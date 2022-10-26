import { resolver } from "@blitzjs/rpc"
import { Address } from "wagmi"
import axios from "axios"
import db from "db"
import { AuthorizationError, NotFoundError } from "blitz"
import { ExternalServiceError } from "app/core/errors/ExternalServiceError"
import { AuthenticatedUser } from "app/auth/components/LoginModal"
import { authenticateUser } from "app/auth/utils/authenticateUser"
import { utils } from "ethers"

// returns an event if doesn't require a password or password correct
// returns null if exists and require a password
// throw not found if not exists
export default resolver.pipe(
  async ({
    address,
    eventId,
    password,
    user,
  }: {
    eventId: number
    address?: Address
    password?: string
    user?: AuthenticatedUser
  }) => {
    if (!address) return false

    const event = await db.event.findFirst({
      where: { id: eventId },
      select: { tokenAddress: true, minBalance: true, chainId: true, hashedPassword: true },
    })
    if (!event) throw new NotFoundError()
    if (event.hashedPassword) {
      if (!password || event.hashedPassword !== utils.keccak256(utils.toUtf8Bytes(password))) {
        if (!user) throw new AuthorizationError()
        await authenticateUser(user)
      }
    }

    const options = {
      method: "GET",
      url: `https://deep-index.moralis.io/api/v2/${address}/nft`,
      params: {
        chain: event.chainId,
        format: "decimal",
        token_addresses: event.tokenAddress,
      },
      headers: { accept: "application/json", "X-API-Key": process.env.MORALIS_API_KEY },
    }

    return await axios
      .request(options)
      .then(function (response) {
        const amount = response.data.result
          .map((e: { amount: string }) => parseInt(e.amount))
          .reduce((a: number, b: number) => a + b, 0)
        return amount >= event.minBalance
      })
      .catch(function (error) {
        throw new ExternalServiceError(error.message)
      })
  }
)

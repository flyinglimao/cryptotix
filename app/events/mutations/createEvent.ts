import { resolver } from "@blitzjs/rpc"
import { AuthenticatedUser } from "app/auth/components/LoginModal"
import { authenticateUser } from "app/auth/utils/authenticateUser"
import { Login } from "app/auth/validations"
import axios from "axios"
import { AuthenticationError } from "blitz"
import db from "db"
import { isAddress } from "ethers/lib/utils"
import { Address } from "wagmi"
import { z } from "zod"
import { InvalidTokenAddressError } from "../errors/InvalidTokenAddressError"

const CreateEvent = z.object({
  name: z.string(),
  hashedPassword: z.string().optional(),
  tokenAddress: z.string().refine(isAddress, { message: "Invalid token address" }),
  chainId: z.string(),
  minBalance: z.number(),
  user: Login,
})

async function validType(address: Address, chain: string): Promise<boolean> {
  const [isNFT, isToken] = await Promise.all([
    axios
      .request({
        method: "GET",
        url: `https://deep-index.moralis.io/api/v2/nft/${address}/metadata`,
        params: { chain },
        headers: { accept: "application/json", "X-API-Key": process.env.MORALIS_API_KEY },
      })
      .then((_) => true)
      .catch((_) => false),
    axios
      .request({
        method: "GET",
        url: "https://deep-index.moralis.io/api/v2/erc20/metadata",
        params: { chain, addresses: address },
        headers: { accept: "application/json", "X-API-Key": process.env.MORALIS_API_KEY },
      })
      .then((res) => res.data[0].decimals.length > 0),
  ])
  return isNFT || isToken
}

export default resolver.pipe(resolver.zod(CreateEvent), async (input) => {
  if (process.env.DISABLE_REGISTER) throw new AuthenticationError()

  await authenticateUser(input.user as AuthenticatedUser)
  if (!(await validType(input.tokenAddress, input.chainId))) throw new InvalidTokenAddressError()

  const event = await db.event.create({
    data: {
      hashedPassword: input.hashedPassword,
      name: input.name,
      tokenAddress: input.tokenAddress,
      chainId: input.chainId,
      minBalance: input.minBalance,
      owner: input.user.address,
    },
  })

  return event
})

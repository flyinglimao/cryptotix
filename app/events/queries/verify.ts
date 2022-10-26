import { resolver } from "@blitzjs/rpc"
import { Address } from "wagmi"
import axios from "axios"
import db from "db"
import { AuthorizationError, NotFoundError } from "blitz"
import { ExternalServiceError } from "app/core/errors/ExternalServiceError"
import { AuthenticatedUser } from "app/auth/components/LoginModal"
import { authenticateUser } from "app/auth/utils/authenticateUser"
import { utils } from "ethers"
import RuleEngine from "../components/RuleEngine"

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
      select: { chainId: true, hashedPassword: true, rule: true },
    })
    if (!event) throw new NotFoundError()
    if (event.hashedPassword) {
      if (!password || event.hashedPassword !== utils.keccak256(utils.toUtf8Bytes(password))) {
        if (!user) throw new AuthorizationError()
        await authenticateUser(user)
      }
    }

    const ruleEngine = new RuleEngine(JSON.parse(event.rule))
    return await ruleEngine.execute(address, event.chainId)
  }
)

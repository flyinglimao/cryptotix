import { resolver } from "@blitzjs/rpc"
import { AuthenticatedUser } from "app/auth/components/LoginModal"
import { authenticateUser } from "app/auth/utils/authenticateUser"
import { AuthenticationError } from "blitz"
import db from "db"
import { constants } from "ethers"
import RuleEngine from "../components/RuleEngine"
import { Rule } from "../components/RuleEngine/ruleTypes"
import { CreateEvent } from "../validations"

class RuleError extends Error {
  statusCode = 400
  name = "RuleError"
  detail = undefined
  constructor(message?: string) {
    super("Invalid rule: " + message)
  }
}

export default resolver.pipe(resolver.zod(CreateEvent), async (input) => {
  if (process.env.DISABLE_REGISTER) throw new AuthenticationError()

  await authenticateUser(input.user as AuthenticatedUser)
  const rule: Rule = JSON.parse(input.rule)
  const simulateRuleEngine = new RuleEngine(rule)
  // it should raise error if rule invalid
  try {
    await simulateRuleEngine.execute("0xf8F7873f80039D59783e7059ECfF5A6C49D70d47", input.chainId)
  } catch (err) {
    throw new RuleError(err.message)
  }

  const event = await db.event.create({
    data: {
      hashedPassword: input.hashedPassword,
      name: input.name,
      chainId: input.chainId,
      owner: input.user.address,
      rule: input.rule,
    },
  })

  return event
})

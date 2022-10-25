import { resolver } from "@blitzjs/rpc"
import { AuthenticatedUser } from "app/auth/components/LoginModal"
import { authenticateUser } from "app/auth/utils/authenticateUser"
import { Login } from "app/auth/validations"
import { AuthenticationError } from "blitz"
import db from "db"
import { isAddress } from "ethers/lib/utils"
import { z } from "zod"

const CreateEvent = z.object({
  name: z.string(),
  hashedPassword: z.string().optional(),
  tokenAddress: z.string().refine(isAddress, { message: "Invalid token address" }),
  chainId: z.string(),
  minBalance: z.number(),
  user: Login,
})

export default resolver.pipe(resolver.zod(CreateEvent), async (input) => {
  if (process.env.DISABLE_REGISTER) throw new AuthenticationError()

  await authenticateUser(input.user as AuthenticatedUser)

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

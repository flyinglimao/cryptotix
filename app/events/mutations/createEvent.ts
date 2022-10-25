import { resolver } from "@blitzjs/rpc"
import { AuthenticatedUser } from "app/auth/components/LoginModal"
import { authenticateUser } from "app/auth/utils/authenticateUser"
import { Login } from "app/auth/validations"
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
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
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

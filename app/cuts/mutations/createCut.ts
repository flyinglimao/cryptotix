import { resolver } from "@blitzjs/rpc"
import { authenticateUser } from "app/auth/utils/authenticateUser"
import { Login } from "app/auth/validations"
import { AuthorizationError } from "blitz"
import db from "db"
import { z } from "zod"

const CreateCut = z.object({
  eventId: z.number(),
  address: z.string(),
  user: Login,
})

export default resolver.pipe(resolver.zod(CreateCut), async (input) => {
  await authenticateUser(input.user)
  const event = await db.event.findFirst({ where: { id: input.eventId } })
  if (event?.owner !== input.user.address) throw new AuthorizationError()

  const cut = await db.cut.create({ data: { eventId: input.eventId, address: input.address } })

  return cut
})

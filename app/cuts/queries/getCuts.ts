import { resolver } from "@blitzjs/rpc"
import { authenticateUser } from "app/auth/utils/authenticateUser"
import { Login } from "app/auth/validations"
import db from "db"
import { z } from "zod"

const GetCut = z.object({
  // This accepts type of undefined, but is required at runtime
  address: z.string().optional(),
  eventId: z.number().optional(),
  user: Login.optional(),
})

export default resolver.pipe(resolver.zod(GetCut), async ({ address, eventId, user }) => {
  if (user) await authenticateUser(user)
  if (!address || !eventId || !user) return []
  const cut = await db.cut.findMany({ where: { address, eventId }, orderBy: { createdAt: "desc" } })

  return cut
})

import { resolver } from "@blitzjs/rpc"
import { AuthenticatedUser } from "app/auth/components/LoginModal"
import { authenticateUser } from "app/auth/utils/authenticateUser"
import db from "db"

export default resolver.pipe(async ({ user }: { user: AuthenticatedUser }) => {
  await authenticateUser(user)

  return (
    (await db.event.findMany({
      where: { owner: user.address },
      select: {
        id: true,
        name: true,
        rule: true,
        chainId: true,
      },
    })) || []
  )
})

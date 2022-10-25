import { resolver } from "@blitzjs/rpc"
import { NotFoundError } from "blitz"
import db from "db"
import { utils } from "ethers"

// returns an event if doesn't require a password or password correct
// returns null if exists and require a password
// throw not found if not exists
export default resolver.pipe(async ({ id, password }: { id?: number; password?: string }) => {
  if (!id) throw new NotFoundError()
  const event = await db.event.findFirst({ where: { id } })

  if (!event) throw new NotFoundError()
  if (event.hashedPassword) {
    if (password && event.hashedPassword === utils.keccak256(utils.toUtf8Bytes(password)))
      return event
    else return null
  }
  return event
})

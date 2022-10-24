import { AuthenticationError } from "blitz"
import db from "db"
import { verifyMessage } from "ethers/lib/utils"
import { Address } from "wagmi"
import { buildLoginMessage } from "./buildLoginMessage"

export const authenticateUser = async (address: Address, signature: string, expireAt: Date) => {
  const expectMessage = buildLoginMessage(address, expireAt)
  try {
    const signer = verifyMessage(expectMessage, signature)
    if (signer !== address) throw new AuthenticationError()
  } catch (err) {
    throw new AuthenticationError()
  }

  const user = await db.user.findFirst({ where: { address } })
  if (!user) {
    // register if not exist
    return await db.user.create({
      data: { address },
      select: { id: true, address: true },
    })
  }

  return user
}

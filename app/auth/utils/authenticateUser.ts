import { AuthenticationError } from "blitz"
import { verifyMessage } from "ethers/lib/utils"
import { AuthenticatedUser } from "../components/LoginModal"
import { buildLoginMessage } from "./buildLoginMessage"

export const authenticateUser = async (user: AuthenticatedUser) => {
  const { address, signature, expireAt } = user
  const expectMessage = buildLoginMessage(address, expireAt)
  try {
    const signer = verifyMessage(expectMessage, signature)
    if (signer !== address) throw new AuthenticationError()
  } catch (err) {
    throw new AuthenticationError()
  }
  return
}

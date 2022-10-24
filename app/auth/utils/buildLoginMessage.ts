import { getAddress } from "@ethersproject/address"
import { Address } from "wagmi"

export function buildLoginMessage(address: Address, expireAt: Date) {
  const checksumAddress = getAddress(address)
  return `I (${checksumAddress}) am signing this message to log in CryptoTix, this signature is valid until ${expireAt.toUTCString()}`
}

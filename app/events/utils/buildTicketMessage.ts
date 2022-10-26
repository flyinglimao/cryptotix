import { getAddress } from "ethers/lib/utils"
import { Address } from "wagmi"

export function buildTicketMessage(address: Address, name: string, tokenAddress: Address) {
  return `I (${getAddress(
    address
  )}) am signing this message to issue a ticket for ${name} with the ownership of tokens of ${getAddress(
    tokenAddress
  )} on CryptoTix`
}

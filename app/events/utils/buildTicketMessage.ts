import { getAddress } from "ethers/lib/utils"
import { Address } from "wagmi"

export function buildTicketMessage(address: Address, name: string, id: number) {
  return `I (${getAddress(
    address
  )}) am signing this message to issue a ticket for event ${name} (CryptoTix:${id}) on CryptoTix`
}

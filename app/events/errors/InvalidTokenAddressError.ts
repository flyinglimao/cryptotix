export class InvalidTokenAddressError extends Error {
  name = "InvalidTokenAddressError"
  constructor() {
    super("The address is not an NFT or ERC20 contract")
  }
}

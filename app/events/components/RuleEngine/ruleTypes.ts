import { Address } from "wagmi"

export type Rule = Union | Intersection | ERC20Ownership | ERC721Ownership | ERC1155Ownership

export interface Union {
  type: "Union"
  rules: Rule[]
}

export interface Intersection {
  type: "Intersection"
  rules: Rule[]
}

export interface ERC20Ownership {
  type: "ERC20Ownership"
  tokenAddress: Address
  chainId: string
  minBalance: number
}

export interface ERC721Ownership {
  type: "ERC721Ownership"
  tokenAddress: Address
  chainId: string
  minBalance: number
  tokenIds?: string[]
  hodlFrom?: number
}

export interface ERC1155Ownership {
  type: "ERC1155Ownership"
  tokenAddress: Address
  chainId: string
  tokenIds?: string[]
  minBalance: number
}

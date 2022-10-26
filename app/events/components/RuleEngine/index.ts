import axios from "axios"
import { BigNumber } from "ethers"
import { parseUnits } from "ethers/lib/utils"
import { Address } from "wagmi"
import { ERC1155Ownership, ERC20Ownership, ERC721Ownership, Rule } from "./ruleTypes"

export async function depagination<T>(
  query: any & { params: Object },
  merge: (exists: T, incoming: any) => any,
  init: T
): Promise<any> {
  let cursor = undefined
  let result = init
  do {
    const res = await axios.request({
      ...query,
      params: {
        ...query.params,
        cursor,
      },
    })

    result = merge(result, res.data)
  } while (cursor)
  return result
}

async function checkERC20Ownership(
  address: Address,
  tokenAddress: Address,
  chainId: string,
  rule: ERC20Ownership
): Promise<boolean> {
  return axios
    .request({
      method: "GET",
      url: `https://deep-index.moralis.io/api/v2/${address}/erc20`,
      params: { chain: chainId, token_addresses: tokenAddress },
      headers: { accept: "application/json", "X-API-Key": process.env.MORALIS_API_KEY },
    })
    .then((res) => {
      if (!res.data[0] || !res.data[0].decimals) throw new Error(`No such ERC-20 ${tokenAddress}`)
      const required = parseUnits(rule.minBalance.toString(), res.data[0].decimals)
      const balance = BigNumber.from(res.data[0].balance)
      return balance.gte(required)
    })
}

async function checkERC721OwnershipInList(
  address: Address,
  tokenAddress: Address,
  chainId: string,
  rule: ERC721Ownership
): Promise<boolean> {
  const holdTokens = await depagination(
    {
      method: "GET",
      url: `https://deep-index.moralis.io/api/v2/${address}/nft`,
      params: {
        chain: chainId,
        format: "decimal",
        limit: "100",
        token_addresses: tokenAddress,
      },
      headers: { accept: "application/json", "X-API-Key": process.env.MORALIS_API_KEY },
    },
    (ext, incoming) => [...ext, ...incoming.result],
    []
  )
  const eligibleTokens = holdTokens.filter(
    (token: { token_id: string; block_number: string }) =>
      (!rule.tokenIds || rule.tokenIds.includes(token.token_id)) &&
      (!rule.hodlFrom || parseInt(token.block_number) <= rule.hodlFrom)
  )
  return eligibleTokens.length >= rule.minBalance
}

async function checkERC1155OwnershipInList(
  address: Address,
  tokenAddress: Address,
  chainId: string,
  rule: ERC1155Ownership
): Promise<boolean> {
  const holdTokens = await depagination(
    {
      method: "GET",
      url: `https://deep-index.moralis.io/api/v2/${address}/nft`,
      params: {
        chain: chainId,
        format: "decimal",
        limit: "100",
        token_addresses: tokenAddress,
      },
      headers: { accept: "application/json", "X-API-Key": process.env.MORALIS_API_KEY },
    },
    (ext, incoming) => [...ext, ...incoming.result],
    []
  )
  const tokenBalances: Array<{ token_id: string; amount: string }> = holdTokens.filter(
    (token: { token_id: string; amount: string }) =>
      !rule.tokenIds || rule.tokenIds.includes(token.token_id)
  )
  return tokenBalances.reduce((a, b) => a + parseInt(b.amount), 0) >= rule.minBalance
}

export class RuleEngine {
  private rootRule: Rule

  constructor(rule: Rule) {
    this.rootRule = rule
  }

  async execute(address: Address, chainId: string): Promise<boolean> {
    switch (this.rootRule.type) {
      case "Union":
        return await Promise.all(
          this.rootRule.rules
            .map((rule) => new RuleEngine(rule))
            .map((subeng) => subeng.execute(address, chainId))
        ).then((results) => results.every((e) => e))
      case "Intersection":
        return await Promise.all(
          this.rootRule.rules
            .map((rule) => new RuleEngine(rule))
            .map((subeng) => subeng.execute(address, chainId))
        ).then((results) => results.some((e) => e))
      case "ERC20Ownership":
        return await checkERC20Ownership(
          address,
          this.rootRule.tokenAddress,
          chainId,
          this.rootRule
        )
      case "ERC721Ownership":
        return await checkERC721OwnershipInList(
          address,
          this.rootRule.tokenAddress,
          chainId,
          this.rootRule
        )
      case "ERC1155Ownership":
        return await checkERC1155OwnershipInList(
          address,
          this.rootRule.tokenAddress,
          chainId,
          this.rootRule
        )
    }
  }
}
export default RuleEngine

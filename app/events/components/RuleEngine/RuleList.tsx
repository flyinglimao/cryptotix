import { ReactElement } from "react"
import { Rule } from "./ruleTypes"

export function RuleList({ rule }: { rule: Rule }): ReactElement {
  switch (rule.type) {
    case "ERC20Ownership":
      return (
        <li>
          Have at least {rule.minBalance} ERC-20 ({rule.tokenAddress}) tokens.
        </li>
      )
    case "ERC721Ownership":
      return (
        <li>
          Have at least {rule.minBalance} {rule.tokenIds ? "specificed" : ""} ERC-721 (
          {rule.tokenAddress}) tokens {rule.hodlFrom ? `since block ${rule.hodlFrom}` : ""}.
        </li>
      )
    case "ERC1155Ownership":
      return (
        <li>
          Have at least {rule.minBalance} {rule.tokenIds ? "specificed" : ""} ERC-1155 (
          {rule.tokenAddress}) tokens.
        </li>
      )
    case "Union":
      return (
        <li>
          Meet all of these requirements:
          <ul>
            {rule.rules.map((e, idx) => (
              <RuleList rule={e} key={idx} />
            ))}
          </ul>
        </li>
      )
    case "Intersection":
      return (
        <li>
          Meet one of these requirements:
          <ul>
            {rule.rules.map((e, idx) => (
              <RuleList rule={e} key={idx} />
            ))}
          </ul>
        </li>
      )
  }
}

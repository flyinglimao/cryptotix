import {
  Button,
  ListItem,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material"
import { constants } from "ethers"
import { isAddress } from "ethers/lib/utils"
import { ReactElement, useState } from "react"
import {
  ERC1155Ownership,
  ERC20Ownership,
  ERC721Ownership,
  Intersection,
  Rule,
  Union,
} from "./ruleTypes"

interface RuleMakerProps {
  rule: Rule | null
  onChange: (newRule: Rule | null) => any
  depth?: number
}

interface RuleProps<T> {
  rule: T
  depth: number
  onChange: (newRule: Rule) => any
  onRemove: () => any
}

const initialValue: { [key: string]: Rule } = {
  ERC20Ownership: {
    type: "ERC20Ownership",
    tokenAddress: constants.AddressZero,
    chainId: "eth",
    minBalance: 1,
  },
  ERC721Ownership: {
    type: "ERC721Ownership",
    tokenAddress: constants.AddressZero,
    chainId: "eth",
    minBalance: 1,
    tokenIds: [],
  },
  ERC1155Ownership: {
    type: "ERC1155Ownership",
    tokenAddress: constants.AddressZero,
    chainId: "eth",
    tokenIds: [],
    minBalance: 1,
  },
  Union: {
    type: "Union",
    rules: [],
  },
  Intersection: {
    type: "Intersection",
    rules: [],
  },
}

function RuleSelect({ onAdd }: { onAdd: (rule: Rule) => any }): ReactElement {
  const [type, setType] = useState<Rule["type"]>("ERC20Ownership")

  return (
    <>
      <Select
        labelId="rule-type-label"
        id="rule-type-select"
        value={type}
        label="Rule Type"
        onChange={(evt) => setType(evt.target.value as Rule["type"])}
        size="small"
        variant="standard"
      >
        <MenuItem value="ERC20Ownership">ERC-20 Rule</MenuItem>
        <MenuItem value="ERC721Ownership">ERC-721 Rule</MenuItem>
        <MenuItem value="ERC1155Ownership">ERC-1155 Rule</MenuItem>
        <MenuItem value="Union">And Rules Group</MenuItem>
        <MenuItem value="Intersection">Or Rules Group</MenuItem>
      </Select>
      <Button variant="outlined" color="primary" onClick={() => onAdd(initialValue[type]!)}>
        Add
      </Button>
    </>
  )
}

function UnionRule({ rule, depth, onChange, onRemove }: RuleProps<Union>): ReactElement {
  return (
    <>
      <TableRow>
        <TableCell sx={{ pl: 4 * depth + 2 }}>
          While <strong>all</strong> the following condition are met:
        </TableCell>
        <TableCell sx={{ textAlign: "right" }}>
          <Button variant="outlined" color="error" onClick={() => onRemove()}>
            Remove
          </Button>
        </TableCell>
      </TableRow>
      {rule.rules.map((childRule, idx) => (
        <TableRow key={idx}>
          <TableCell colSpan={2} sx={{ pt: 0, pr: 0, pb: 0 }}>
            <RuleMaker
              rule={childRule}
              onChange={(newRule) => {
                const rules = [...rule.rules]
                if (!newRule) rules.splice(idx, 1)
                else rules.splice(idx, 1, newRule)

                onChange({
                  ...rule,
                  rules,
                })
              }}
              depth={depth + 1}
            />
          </TableCell>
        </TableRow>
      ))}
      <TableRow>
        <TableCell colSpan={2} sx={{ pl: 4 * depth + 4 }}>
          <RuleSelect
            onAdd={(newRule) => {
              onChange({
                ...rule,
                rules: [...rule.rules, newRule],
              })
            }}
          />
        </TableCell>
      </TableRow>
    </>
  )
}

function IntersectionRule({
  rule,
  depth,
  onChange,
  onRemove,
}: RuleProps<Intersection>): ReactElement {
  return (
    <>
      <TableRow>
        <TableCell sx={{ pl: 4 * depth + 2 }}>
          While <strong>any one of</strong> the following condition are met:
        </TableCell>
        <TableCell sx={{ textAlign: "right" }}>
          <Button variant="outlined" color="error" onClick={() => onRemove()}>
            Remove
          </Button>
        </TableCell>
      </TableRow>
      {rule.rules.map((childRule, idx) => (
        <TableRow key={idx}>
          <TableCell colSpan={2} sx={{ pt: 0, pr: 0, pb: 0 }}>
            <RuleMaker
              rule={childRule}
              onChange={(newRule) => {
                const rules = [...rule.rules]
                if (!newRule) rules.splice(idx, 1)
                else rules.splice(idx, 1, newRule)

                onChange({
                  ...rule,
                  rules,
                })
              }}
              depth={depth + 1}
            />
          </TableCell>
        </TableRow>
      ))}
      <TableRow>
        <TableCell colSpan={2} sx={{ pl: 4 * depth + 4 }}>
          <RuleSelect
            onAdd={(newRule) => {
              onChange({
                ...rule,
                rules: [...rule.rules, newRule],
              })
            }}
          />
        </TableCell>
      </TableRow>
    </>
  )
}

function ERC20Rule({ rule, depth, onChange, onRemove }: RuleProps<ERC20Ownership>): ReactElement {
  const [address, setAddress] = useState<string>(rule.tokenAddress)
  const [error, setError] = useState<string>("")

  return (
    <TableRow>
      <TableCell sx={{ pl: 4 * depth + 2 }}>
        <span>If the user has at least</span>
        <TextField
          variant="standard"
          value={rule.minBalance}
          size="small"
          sx={{ mx: "0.2rem" }}
          onChange={(evt) =>
            onChange({
              ...rule,
              minBalance: parseInt(evt.target.value) || 0,
            })
          }
        />
        <span>tokens of ERC-20</span>
        <TextField
          variant="standard"
          value={address}
          size="small"
          sx={{ mx: "0.2rem" }}
          onChange={(evt) => {
            setAddress(evt.target.value)
            if (isAddress(evt.target.value)) {
              setError("")
              onChange({
                ...rule,
                tokenAddress: evt.target.value,
              })
            } else {
              setError("Address invalid")
            }
          }}
          error={!!error}
          helperText={error}
        />
        <span>.</span>
      </TableCell>
      <TableCell sx={{ textAlign: "right" }}>
        <Button variant="outlined" color="error" onClick={() => onRemove()}>
          Remove
        </Button>
      </TableCell>
    </TableRow>
  )
}

function parseRange(range: string): string[] | undefined | "ERROR" {
  if (range === "*") return undefined
  const ranges = range.split(",")
  const result: string[] = []
  for (let subrange of ranges) {
    const splited = subrange.split("-")
    if (!isNaN(Number(subrange)) && Number.isInteger(parseInt(subrange))) {
      result.push(subrange)
    } else if (
      splited.length === 2 &&
      Number.isInteger(parseInt(splited[0]!)) &&
      Number.isInteger(parseInt(splited[1]!))
    ) {
      const end = parseInt(splited[1]!)
      for (let i = parseInt(splited[0]!); i <= end; i++) result.push(i.toString())
    } else {
      return "ERROR"
    }
  }

  return result
}

function ERC721Rule({ rule, depth, onChange, onRemove }: RuleProps<ERC721Ownership>): ReactElement {
  const [address, setAddress] = useState<string>(rule.tokenAddress)
  const [addressError, setAddressError] = useState<string>("")
  const [range, setRange] = useState("*")
  const [rangeError, setRangeError] = useState<string>("")

  return (
    <TableRow>
      <TableCell
        sx={{ pl: 4 * depth + 2, display: "flex", flexWrap: "wrap", alignItems: "bottom" }}
      >
        <span>If the user has at least</span>
        <TextField
          variant="standard"
          value={rule.minBalance}
          size="small"
          sx={{ mx: "0.2rem" }}
          onChange={(evt) =>
            onChange({
              ...rule,
              minBalance: parseInt(evt.target.value) || 0,
            })
          }
        />
        <span>tokens of ERC-721</span>
        <TextField
          variant="standard"
          value={address}
          size="small"
          sx={{ mx: "0.2rem" }}
          onChange={(evt) => {
            setAddress(evt.target.value)
            if (isAddress(evt.target.value)) {
              setAddressError("")
              onChange({
                ...rule,
                tokenAddress: evt.target.value,
              })
            } else {
              setAddressError("Address invalid")
            }
          }}
          error={!!addressError}
          helperText={addressError}
        />
        <span>and hodl from block</span>
        <TextField
          variant="standard"
          value={rule.hodlFrom}
          size="small"
          sx={{ mx: "0.2rem" }}
          placeholder="not specific"
          onChange={(evt) =>
            onChange({
              ...rule,
              hodlFrom: parseInt(evt.target.value) || undefined,
            })
          }
        />
        <span>whose id in the range</span>
        <TextField
          variant="standard"
          value={range}
          size="small"
          sx={{ mx: "0.2rem" }}
          onChange={(evt) => {
            setRange(evt.target.value)
            const parsed = parseRange(evt.target.value)
            if (parsed !== "ERROR") {
              setRangeError("")
              onChange({
                ...rule,
                tokenIds: parsed,
              })
            } else {
              setRangeError("Range invalid")
            }
          }}
          error={!!rangeError}
          helperText={rangeError || "1-3,6 or *"}
        />
        <span>.</span>
      </TableCell>
      <TableCell sx={{ textAlign: "right" }}>
        <Button variant="outlined" color="error" onClick={() => onRemove()}>
          Remove
        </Button>
      </TableCell>
    </TableRow>
  )
}

function ERC1155Rule({
  rule,
  depth,
  onChange,
  onRemove,
}: RuleProps<ERC1155Ownership>): ReactElement {
  const [address, setAddress] = useState<string>(rule.tokenAddress)
  const [addressError, setAddressError] = useState<string>("")
  const [range, setRange] = useState("*")
  const [rangeError, setRangeError] = useState<string>("")

  return (
    <TableRow>
      <TableCell sx={{ pl: 4 * depth + 2 }}>
        <span>If the sum of user&apos;s balance of ERC-1155</span>
        <TextField
          variant="standard"
          value={address}
          size="small"
          sx={{ mx: "0.2rem" }}
          onChange={(evt) => {
            setAddress(evt.target.value)
            if (isAddress(evt.target.value)) {
              setAddressError("")
              onChange({
                ...rule,
                tokenAddress: evt.target.value,
              })
            } else {
              setAddressError("Address invalid")
            }
          }}
          error={!!addressError}
          helperText={addressError}
        />
        <span>tokens whose id is in the range</span>
        <TextField
          variant="standard"
          value={range}
          size="small"
          sx={{ mx: "0.2rem" }}
          onChange={(evt) => {
            setRange(evt.target.value)
            const parsed = parseRange(evt.target.value)
            if (parsed !== "ERROR") {
              setRangeError("")
              onChange({
                ...rule,
                tokenIds: parsed,
              })
            } else {
              setRangeError("Range invalid")
            }
          }}
          error={!!rangeError}
          helperText={rangeError || "1-3,6 or *"}
        />
        <span>is greater than</span>
        <TextField
          variant="standard"
          value={rule.minBalance}
          size="small"
          sx={{ mx: "0.2rem" }}
          onChange={(evt) =>
            onChange({
              ...rule,
              minBalance: parseInt(evt.target.value) || 0,
            })
          }
        />
        <span>.</span>
      </TableCell>
      <TableCell sx={{ textAlign: "right" }}>
        <Button variant="outlined" color="error" onClick={() => onRemove()}>
          Remove
        </Button>
      </TableCell>
    </TableRow>
  )
}

export function RuleMaker({ rule, onChange, depth = 0 }: RuleMakerProps): ReactElement {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          {!rule && (
            <ListItem>
              <RuleSelect onAdd={onChange} />
            </ListItem>
          )}
          {rule?.type === "Union" && (
            <UnionRule
              rule={rule}
              depth={depth}
              onChange={onChange}
              onRemove={() => onChange(null)}
            />
          )}
          {rule?.type === "Intersection" && (
            <IntersectionRule
              rule={rule}
              depth={depth}
              onChange={onChange}
              onRemove={() => onChange(null)}
            />
          )}
          {rule?.type === "ERC20Ownership" && (
            <ERC20Rule
              rule={rule}
              depth={depth}
              onChange={onChange}
              onRemove={() => onChange(null)}
            />
          )}
          {rule?.type === "ERC721Ownership" && (
            <ERC721Rule
              rule={rule}
              depth={depth}
              onChange={onChange}
              onRemove={() => onChange(null)}
            />
          )}
          {rule?.type === "ERC1155Ownership" && (
            <ERC1155Rule
              rule={rule}
              depth={depth}
              onChange={onChange}
              onRemove={() => onChange(null)}
            />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

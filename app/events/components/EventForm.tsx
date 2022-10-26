import { Button, FormControl, InputLabel, MenuItem, Typography } from "@mui/material"
import { Form, FormProps } from "app/core/components/Form"
import { TextField, Select } from "mui-rff"
import { useState } from "react"
import { Field } from "react-final-form"
import { z } from "zod"
import { RuleMaker } from "./RuleEngine/RuleMaker"
import { Rule } from "./RuleEngine/ruleTypes"
export { FORM_ERROR } from "app/core/components/Form"

export function EventForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [rule, setRule] = useState<Rule | null>(null)
  return (
    <Form<S> {...props}>
      <TextField required id="name" name="name" label="Event Name" fullWidth />
      <TextField
        id="hashedPassword"
        name="hashedPassword"
        label="Password"
        fullWidth
        helperText="If given, only people who have this password can issue their ticket."
      />
      <FormControl fullWidth>
        <Select id="chain-input-select" label="Chain" name="chainId" required>
          <MenuItem value="eth">Ethereum</MenuItem>
          <MenuItem value="polygon">Polygon</MenuItem>
          <MenuItem value="bsc">BSC</MenuItem>
          <MenuItem value="avalanche">Avalanche</MenuItem>
          <MenuItem value="fantom">Fantom</MenuItem>
          <MenuItem value="goerli">Goerli Testnet</MenuItem>
          <MenuItem value="mumbai">Mumbai Testnet (Polygon Testnet)</MenuItem>
          <MenuItem value="bsc testnet">BSC Testnet</MenuItem>
          <MenuItem value="avalanche testnet">Avalanche Testnet</MenuItem>
        </Select>
      </FormControl>
      <Field name="rule">
        {(props) => (
          <>
            <RuleMaker
              rule={rule}
              onChange={(newRule) => {
                setRule(newRule)
                props.input.onChange(JSON.stringify(newRule))
              }}
            />
            <Typography variant="caption" color="error" sx={{ ml: "14px", mt: "3px" }}>
              {props.meta.error || props.meta.submitError}
            </Typography>
          </>
        )}
      </Field>
      <Button type="submit" variant="contained" sx={{ float: "right" }}>
        Submit
      </Button>
      <style global jsx>{`
        .form > * + * {
          margin-top: 1rem;
        }
      `}</style>
    </Form>
  )
}

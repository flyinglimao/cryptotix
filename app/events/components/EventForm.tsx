import { Button, FormControl, InputLabel, MenuItem } from "@mui/material"
import { Form, FormProps } from "app/core/components/Form"
import { TextField, Select } from "mui-rff"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function EventForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
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
        <InputLabel id="chain-input-label">Chain</InputLabel>
        <Select
          labelId="chain-input-label"
          id="chain-input-select"
          label="Chain"
          name="chainId"
          required
        >
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
      <TextField required id="tokenAddress" name="tokenAddress" label="Token Address" fullWidth />
      <TextField required id="rule" name="rule" label="Min Balance" fullWidth />
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

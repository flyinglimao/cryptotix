import { Button, TextField as MUITextField } from "@mui/material"
import { Form, FormProps } from "app/core/components/Form"
import { TextField } from "mui-rff"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

type TokenType = "ERC-20" | "ERC-721" | "ERC-1155" | "Unknown"

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
      <TextField required id="chainId" name="chainId" label="Chain ID" fullWidth />
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

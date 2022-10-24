import { getAddress } from "@ethersproject/address"
import { z } from "zod"

export const address = z.string()

export const Login = z.object({
  address: z.string().regex(/0x[0-9a-zA-Z]40/),
  signature: z.string(),
  expireAt: z.date(),
})

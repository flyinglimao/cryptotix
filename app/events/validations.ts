import { Login } from "app/auth/validations"
import { z } from "zod"

export const Event = z.object({
  name: z.string(),
  hashedPassword: z.string(),
  chainId: z.string(),
  rule: z.string(),
})

export const CreateEvent = z.object({
  name: z.string(),
  hashedPassword: z.string(),
  chainId: z.string(),
  rule: z.string(),
  user: Login,
})

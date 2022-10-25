import { isAddress } from "ethers/lib/utils"
import { z } from "zod"

export const Login = z.object({
  address: z.string().refine(isAddress),
  signature: z.string(),
  expireAt: z.date(),
})

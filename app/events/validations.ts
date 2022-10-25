import { isAddress } from "ethers/lib/utils"
import { z } from "zod"

export const CreateEvent = z.object({
  name: z.string(),
  hashedPassword: z.string(),
  tokenAddress: z.string().refine(isAddress, { message: "Invalid token address" }),
  chainId: z.string(),
  minBalance: z.number(),
})

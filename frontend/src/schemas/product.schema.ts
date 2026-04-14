import { z } from "zod"
import { nanoid } from "nanoid"

export const productSchema = z.object({
  product_id: z
    .string()
    .length(32)
    .default(() => nanoid(32)),
  product_name: z.string().min(2, "Nome obrigatório").max(255),
  product_category: z.string().optional().nullable(),
  product_weight_grams: z.coerce.number().min(0).optional().nullable(),
  length_cm: z.coerce.number().min(0).optional().nullable(),
  height_cm: z.coerce.number().min(0).optional().nullable(),
  width_cm: z.coerce.number().min(0).optional().nullable(),
})

export type ProductFormData = z.infer<typeof productSchema>

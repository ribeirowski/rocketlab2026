import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema, type ProductFormData } from "@/schemas/product.schema"
import { useCreateProduct, useUpdateProduct } from "@/hooks/useProducts"
import { useUIStore } from "@/store/ui.store"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { Product } from "@/types"

interface ProductFormProps {
  existingProduct?: Product
}

export function ProductForm({ existingProduct }: ProductFormProps) {
  const { productFormOpen, closeForm, editingProductId } = useUIStore()
  const isEditing = !!editingProductId
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      product_id: existingProduct?.product_id ?? "",
      product_name: existingProduct?.product_name ?? "",
      product_category: existingProduct?.product_category ?? "",
      product_weight_grams: existingProduct?.product_weight_grams ?? undefined,
      length_cm: existingProduct?.length_cm ?? undefined,
      height_cm: existingProduct?.height_cm ?? undefined,
      width_cm: existingProduct?.width_cm ?? undefined,
    },
  })

  useEffect(() => {
    if (existingProduct) form.reset({ ...existingProduct })
  }, [existingProduct])

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEditing) {
        const { product_id, ...rest } = data
        await updateProduct.mutateAsync({ id: product_id, data: rest })
        toast.success("Produto atualizado!")
      } else {
        await createProduct.mutateAsync(data)
        toast.success("Produto criado!")
      }
      closeForm()
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  const isPending = createProduct.isPending || updateProduct.isPending

  const dimensionFields = [
    { name: "product_weight_grams" as const, label: "Peso (g)" },
    { name: "length_cm" as const, label: "Comprimento (cm)" },
    { name: "height_cm" as const, label: "Altura (cm)" },
    { name: "width_cm" as const, label: "Largura (cm)" },
  ]

  return (
    <Dialog open={productFormOpen} onOpenChange={closeForm}>
      <DialogContent className="max-h-[90dvh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar produto" : "Novo produto"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nome */}
            <FormField
              name="product_name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do produto</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Categoria */}
            <FormField
              name="product_category"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Categoria{" "}
                    <span className="text-xs text-muted-foreground">
                      (slug, ex: brinquedos)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="ex: eletronicos"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dimensões */}
            <div>
              <p className="mb-3 text-sm font-medium">
                Dimensões{" "}
                <span className="text-xs text-muted-foreground">
                  (opcional)
                </span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                {dimensionFields.map(({ name, label }) => (
                  <FormField
                    key={name}
                    name={name}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">{label}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? null
                                  : Number(e.target.value)
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? "Salvando..."
                  : isEditing
                    ? "Salvar"
                    : "Criar produto"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

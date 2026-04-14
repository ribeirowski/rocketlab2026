export interface Product {
  product_id: string
  product_name: string
  product_category: string | null
  product_weight_grams: number | null
  length_cm: number | null
  height_cm: number | null
  width_cm: number | null
  average_rating: number | null
  total_sales: number | null
  category_image_url: string | null
}

export interface OrderReview {
  review_id: string
  order_id: string
  rating: number
  comment_title: string | null
  comment_text: string | null
  comment_at: string | null
  reply_at: string | null
}

export type ProductCreate = Omit<
  Product,
  "average_rating" | "total_sales" | "category_image_url"
>
export type ProductUpdate = Partial<Omit<ProductCreate, "product_id">>

export interface ProductFilters {
  search?: string
  category?: string
  skip?: number
  limit?: number
}

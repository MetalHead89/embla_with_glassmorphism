/** Модель товара (DummyJSON / vision.md §3) */
export interface Product {
  id: number
  title: string
  description: string
  price: number
  images: string[]
  brand?: string
  category?: string
}

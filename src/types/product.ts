export interface Product {
  id: string
  title: string
  description: string
  price: number
  category: 'mascotas' | 'cocina' | 'corporativo'
  image_url: string
  stock: number
  active: boolean
  created_at: string
}

export interface CartItem extends Product {
  quantity: number
}

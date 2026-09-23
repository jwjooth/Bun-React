export interface Pagination<T> {
    data: T[],
    page: number
    limit: number
    total: number
    totalPages: number
}

export interface ProductRequest {
    name: string
    description: string
    price: number
    category: string
    imageUrl: string
    stock: number
    rating: number
    reviewCount: number
    sku: string
}

export interface ProductResponse {
    id: number
    name: string
    description: string
    price: number
    category: string
    imageUrl: string
    stock: number
    rating: number
    reviewCount: number
    sku: string
    createdAt: string
    updatedAt: string
}
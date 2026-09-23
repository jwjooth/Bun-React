export interface BookRequest {
    author: string
    category_id: number
    stock: number
    title: string
}

export interface BookResponse {
    id: number
    category_id: number
    title: string
    author: string
    stock: number
    created_at: string
    updated_at: string
}

interface metaBookPagination {
    page: number
    per_page: number
    total: number
    total_page: number
}

export interface BookPaginationAPI<T> {
    data: T[]
    meta: metaBookPagination
}
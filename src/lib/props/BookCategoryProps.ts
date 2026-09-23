export interface BookCategoryRequest {
    name: string
}

export interface BookCategoryResponse {
    id: number
    name: string
    created_at: string
    updated_at: string
}

export interface BookCategoryPagination<T> {
    message: string
    data: T
}
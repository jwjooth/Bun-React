import {API_BASE_URL, type deleteMessageResponse} from "@/lib/constant/constant.ts";
import {fetchDeleteHelper, fetchGetHelper, fetchJson, fetchPostHelper, fetchUpdateHelper} from "@/lib/utils/fetchHelper.ts";
import type {BookCategoryPagination, BookCategoryRequest, BookCategoryResponse} from "@/lib/props/BookCategoryProps.ts";

export const getAllBookCategory = async (): Promise<BookCategoryPagination<BookCategoryResponse[]>> => {
    return fetchJson<BookCategoryPagination<BookCategoryResponse[]>>(`${API_BASE_URL}/categories`, fetchGetHelper())
}

export const getBookCategoryById = async (id: number): Promise<BookCategoryResponse> => {
    return fetchJson<BookCategoryResponse>(`${API_BASE_URL}/categories/${id}`, fetchGetHelper())
}

export const createBookCategory = async (request: BookCategoryRequest): Promise<BookCategoryResponse> => {
    return fetchJson<BookCategoryResponse>(`${API_BASE_URL}/categories`, fetchPostHelper(request))
}

export const updateBookCategory = async (id: number, request: BookCategoryRequest): Promise<BookCategoryResponse> => {
    return fetchJson<BookCategoryResponse>(`${API_BASE_URL}/categories/${id}`, fetchUpdateHelper(request))
}

export const deleteBookCategory = async (id: number): Promise<deleteMessageResponse> => {
    return fetchJson<deleteMessageResponse>(`${API_BASE_URL}/categories/${id}`, fetchDeleteHelper())
}

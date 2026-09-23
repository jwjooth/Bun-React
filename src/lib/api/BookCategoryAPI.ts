import {API_BASE_URL, type deleteMessageResponse} from "@/lib/constant/constant.ts";
import {fetchDeleteHelper, fetchGetHelper, fetchPostHelper, fetchUpdateHelper} from "@/lib/utils/fetchHelper.ts";
import type {BookCategoryPagination, BookCategoryRequest, BookCategoryResponse} from "@/lib/props/BookCategoryProps.ts";

export const getAllBookCategory = async (): Promise<BookCategoryPagination<BookCategoryResponse[]>> => {
    return (await fetch(`${API_BASE_URL}/categories`, fetchGetHelper())).json()
}

export const getBookCategoryById = async (id: number): Promise<BookCategoryResponse> => {
    return (await fetch(`${API_BASE_URL}/categories/${id}`, fetchGetHelper())).json()
}

export const createBookCategory = async (request: BookCategoryRequest): Promise<BookCategoryResponse> => {
    return (await fetch(`${API_BASE_URL}/categories`, fetchPostHelper(request))).json()
}

export const updateBookCategory = async (id: number, request: BookCategoryRequest): Promise<BookCategoryResponse> => {
    return (await fetch(`${API_BASE_URL}/categories/${id}`, fetchUpdateHelper(request))).json()
}

export const deleteBookCategory = async (id: number): Promise<deleteMessageResponse> => {
    return (await fetch(`${API_BASE_URL}/categories/${id}`, fetchDeleteHelper())).json()
}
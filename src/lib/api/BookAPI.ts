import type {BookPaginationAPI, BookRequest, BookResponse} from "@/lib/props/BookProps.ts";
import {API_BASE_URL, type deleteMessageResponse} from "@/lib/constant/constant.ts";
import {fetchDeleteHelper, fetchGetHelper, fetchJson, fetchPostHelper, fetchUpdateHelper} from "@/lib/utils/fetchHelper.ts";

export const getAllBook = async (page: number, per_page: number): Promise<BookPaginationAPI<BookResponse>> => {
    return fetchJson<BookPaginationAPI<BookResponse>>(`${API_BASE_URL}/books?page=${page}&per_page=${per_page}`, fetchGetHelper())
}

export const getBookById = async (id: number): Promise<BookResponse> => {
    return fetchJson<BookResponse>(`${API_BASE_URL}/books/${id}`, fetchGetHelper())
}

export const createBook = async (request: BookRequest): Promise<BookResponse> => {
    return fetchJson<BookResponse>(`${API_BASE_URL}/books`, fetchPostHelper(request))
}

export const updateBook = async (id: number, request: BookRequest): Promise<BookResponse> => {
    return fetchJson<BookResponse>(`${API_BASE_URL}/books/${id}`, fetchUpdateHelper(request))
}

export const deleteBook = async (id: number): Promise<deleteMessageResponse> => {
    return fetchJson<deleteMessageResponse>(`${API_BASE_URL}/books/${id}`, fetchDeleteHelper())
}

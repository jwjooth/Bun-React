import type {BookPaginationAPI, BookRequest, BookResponse} from "@/lib/props/BookProps.ts";
import {API_BASE_URL, type deleteMessageResponse} from "@/lib/constant/constant.ts";
import {fetchDeleteHelper, fetchGetHelper, fetchPostHelper, fetchUpdateHelper} from "@/lib/utils/fetchHelper.ts";

export const getAllBook = async (page: number, per_page: number): Promise<BookPaginationAPI<BookResponse>> => {
    return (await fetch(`${API_BASE_URL}/books?page=${page}&per_page=${per_page}`, fetchGetHelper())).json()
}

export const getBookById = async (id: number): Promise<BookResponse> => {
    return (await fetch(`${API_BASE_URL}/books/${id}`, fetchGetHelper())).json()
}

export const createBook = async (request: BookRequest): Promise<BookResponse> => {
    return (await fetch(`${API_BASE_URL}/books`, fetchPostHelper(request))).json()
}

export const updateBook = async (id: number, request: BookRequest): Promise<BookResponse> => {
    return (await fetch(`${API_BASE_URL}/books/${id}`, fetchUpdateHelper(request))).json()
}

export const deleteBook = async (id: number): Promise<deleteMessageResponse> => {
    return (await fetch(`${API_BASE_URL}/books`, fetchDeleteHelper())).json()
}
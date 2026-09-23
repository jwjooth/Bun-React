import type {Pagination, ProductRequest, ProductResponse} from "@/lib/props/ProductProps.ts";
import {fetchDeleteHelper, fetchGetHelper, fetchJson, fetchPostHelper, fetchUpdateHelper} from "@/lib/utils/fetchHelper.ts";
import {API_BASE_URL, type deleteMessageResponse} from "@/lib/constant/constant.ts";

export const getAllProduct = async (page: number, limit: number): Promise<Pagination<ProductResponse>> => {
    return fetchJson<Pagination<ProductResponse>>(`${API_BASE_URL}/products?page=${page}&limit=${limit}`, fetchGetHelper())
}

const getProductById = async (id: number): Promise<ProductResponse> => {
    return fetchJson<ProductResponse>(`${API_BASE_URL}/products/${id}`, fetchGetHelper())
}

const createProduct = async (request: ProductRequest): Promise<ProductResponse> => {
    return fetchJson<ProductResponse>(`${API_BASE_URL}/products`, fetchPostHelper(request))
}

const updateProduct = async (id: number, request: ProductRequest): Promise<ProductResponse> => {
    return fetchJson<ProductResponse>(`${API_BASE_URL}/products/${id}`, fetchUpdateHelper(request))
}

const deleteProduct = async (id: number): Promise<deleteMessageResponse> => {
    return fetchJson<deleteMessageResponse>(`${API_BASE_URL}/products/${id}`, fetchDeleteHelper())
}

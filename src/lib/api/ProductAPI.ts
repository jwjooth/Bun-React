import type {Pagination, ProductRequest, ProductResponse} from "@/lib/props/ProductProps.ts";
import {fetchDeleteHelper, fetchGetHelper, fetchPostHelper, fetchUpdateHelper} from "@/lib/utils/fetchHelper.ts";
import {API_BASE_URL, type deleteMessageResponse} from "@/lib/constant/constant.ts";

export const getAllProduct = async (page: number, limit: number): Promise<Pagination<ProductResponse>> => {
    return (await fetch(`${API_BASE_URL}/products?page=${page}&limit=${limit}`, fetchGetHelper())).json()
}

const getProductById = async (id: number): Promise<ProductResponse> => {
    return (await fetch(`${API_BASE_URL}/products/${id}`, fetchGetHelper())).json()
}

const createProduct = async (request: ProductRequest): Promise<ProductResponse> => {
    return (await fetch(`${API_BASE_URL}/products`, fetchPostHelper(request))).json()
}

const updateProduct = async (id: number, request: ProductRequest): Promise<ProductResponse> => {
    return (await fetch(`${API_BASE_URL}/producsts/${id}`, fetchUpdateHelper(request))).json()
}

const deleteProduct = async (id: number): Promise<deleteMessageResponse> => {
    return (await fetch(`${API_BASE_URL}/products/${id}`, fetchDeleteHelper())).json()
}
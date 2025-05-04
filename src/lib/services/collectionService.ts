import type { CollectionFull } from "$lib/types/collections";
import { API_BASE, doApiRequest, type ApiRequestOptions, type ApiResponse, type DoApiRequestOptions } from "./base";

export async function getCollections(options: ApiRequestOptions): Promise<ApiResponse<CollectionFull[]>> {
    const requestOptions = {
        ...options,
        method: 'GET',
        path: API_BASE + '/collection'
    } satisfies DoApiRequestOptions

    return await doApiRequest(requestOptions);
}
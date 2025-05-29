import type { ApiUser } from '$lib/types/user';
import {
    API_BASE,
    doApiRequest,
    type ApiRequestOptions,
    type ApiResponse,
    type DoApiRequestOptions
} from './base';

export async function searchUsers(
    excludeSelf: boolean,
    search: string | null,
    limit: number,
    options: ApiRequestOptions
): Promise<ApiResponse<ApiUser[]>> {
    const params = new URLSearchParams({
        exclude_self: excludeSelf.toString(),
        limit: limit.toString()
    });

    if (search) {
        params.set('search', search);
    }
    const requestOptions = {
        ...options,
        method: 'GET',
        path: API_BASE + `/user/?${params.toString()}`
    } satisfies DoApiRequestOptions;

    return await doApiRequest(requestOptions);
}

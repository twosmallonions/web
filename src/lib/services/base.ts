import { getContext } from 'svelte';
import { ApiBadRequestError, ApiError, ApiErrorDescription, ApiNotFoundError, ApiUnknownError, ApiValidationError } from './apiError';

export interface FetchObject {
    (input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
    (input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response>;
}


export interface ApiRequestOptions {
    accessToken: string;
    fetch: FetchObject;
}

export interface DoApiRequestOptions extends ApiRequestOptions {
    path: string;
    method: string;
    body?: BodyInit | null;
    headers?: HeadersInit;
    timeoutMs?: number;
}

export type ApiResponse<T> = T | ApiErrorDescription;

export const API_BASE = "/api"; 

export async function doApiRequest<T>(options: DoApiRequestOptions, autoSetContentTypeJson=true): Promise<ApiResponse<T>> {
    const timeoutMs = options.timeoutMs ?? 10000;
    const headers = new Headers(options.headers);
    headers.set('authorization', `Bearer ${options.accessToken}`);
    if (!headers.get('content-type') && options.body && autoSetContentTypeJson) {
        headers.set('content-type', 'application/json')
    }

    const res = await options.fetch(options.path, {
        body: options.body,
        method: options.method,
        credentials: 'omit',
        signal: AbortSignal.timeout(timeoutMs),
        headers
    });

    if (!res.ok) {
        return await mapError(res);
    }

    if (res.status === 204) {
        return {} as T;
    }

    const contentType = res.headers.get('content-type') 
    if (contentType && contentType.toLowerCase() === 'application/json') {
        return (await res.json()) as T;
    }

    return await res.text() as T;
}

async function mapError(res: Response): Promise<ApiErrorDescription> {
    if (res.status === 422) {
        const body = await res.json();
        return new ApiValidationError(body, res.status);
    }

    if (res.status === 404) {
        return new ApiNotFoundError(new URL(res.url).pathname)
    }

    if (res.status === 400) {
        const body = await res.json();
        console.log(body);
        return new ApiBadRequestError(body);
    }

    return new ApiUnknownError(res.status);
}

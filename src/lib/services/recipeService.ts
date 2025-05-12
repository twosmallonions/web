import type { FullRecipe, RecipeCreate, RecipeImport, RecipeLight, RecipeUpdate } from "$lib/types/recipe";
import { API_BASE, doApiRequest, type ApiRequestOptions, type ApiResponse, type DoApiRequestOptions } from "./base";

export async function createRecipe(collectionId: string, recipeCreate: RecipeCreate, options: ApiRequestOptions): Promise<ApiResponse<FullRecipe>> {
    const requestOptions = {
        ...options,
        method: 'POST',
        path: API_BASE + `/recipe/${collectionId}`,
        body: JSON.stringify(recipeCreate)
    } satisfies DoApiRequestOptions

    return await doApiRequest(requestOptions);
}

export async function getRecipe(collectionId: string, recipeId: string, options: ApiRequestOptions): Promise<ApiResponse<FullRecipe>> {
    const requestOptions = {
        ...options,
        method: 'GET',
        path: API_BASE + `/recipe/${collectionId}/${recipeId}`
    } satisfies DoApiRequestOptions

    return await doApiRequest(requestOptions);
}

export async function getRecipesForUser(sortField: string, sortOrder: string, cursor: string | null, limit: string | null, options: ApiRequestOptions): Promise<ApiResponse<RecipeLight[]>> {
    let params = new URLSearchParams({field: sortField, order:sortOrder}) 
    if (cursor) {
        params.set('cursor', cursor)
    }

    if (limit) {
        params.set('limit', limit)
    }

    const requestOptions = {
        ...options,
        method: 'GET',
        path: API_BASE + `/recipe?${params.toString()}`
    } satisfies DoApiRequestOptions

    return await doApiRequest(requestOptions);
}

export async function importRecipe(recipeImport: RecipeImport, collectionId: string, options: ApiRequestOptions): Promise<ApiResponse<FullRecipe>> {
    const requestOptions = {
        ...options,
        method: 'POST',
        path: API_BASE + `/recipe/${collectionId}/import`,
        body: JSON.stringify(recipeImport)
    } satisfies DoApiRequestOptions

    return await doApiRequest(requestOptions);
}

export async function updateRecipe(recipeUpdate: RecipeUpdate, recipeId: string, collectionId: string, options: ApiRequestOptions): Promise<ApiResponse<FullRecipe>> {
    const requestOptions = {
        ...options,
        method: 'PUT',
        path: API_BASE + `/recipe/${collectionId}/${recipeId}`,
        body: JSON.stringify(recipeUpdate)
    } satisfies DoApiRequestOptions

    return await doApiRequest(requestOptions);
}
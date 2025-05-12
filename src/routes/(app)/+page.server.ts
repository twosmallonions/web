import { ApiErrorDescription } from '$lib/services/apiError';
import { getRecipesForUser } from '$lib/services/recipeService';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { invalidate } from '$app/navigation';

export const load: PageServerLoad = async ({ fetch, parent, url }) => {
    const { accessToken } = await parent();

    const sortField = url.searchParams.get('field') ?? 'created_at';
    const sortOrder = url.searchParams.get('order')?.toUpperCase() ?? 'DESC'
    const cursor = url.searchParams.get('cursor');
    const limit = url.searchParams.get('limit');
    const recipes = await getRecipesForUser(sortField, sortOrder, cursor, limit, {accessToken, fetch})

    if (recipes instanceof ApiErrorDescription) {
        console.error(JSON.stringify(recipes, undefined, 2));
        error(recipes.statusCode, {message: recipes.humanDescription});
    }

    return {
        recipeProps: recipes,
    };
};
import { ApiError } from '$lib/services/apiError';
import { getRecipeBySlug } from '$lib/services/recipeService';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params, fetch }) => {
    try {
        const recipe = await getRecipeBySlug(params.slug, fetch);

        return {
            recipeSlug: params.slug,
            recipe
        };
    } catch (e) {
        console.error(e);
        if (e instanceof ApiError) {
            error(e.statusCode, { message: e.message });
        }
        error(500, { message: 'Oops, something went wrong...' });
    }
};
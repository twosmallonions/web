import { ApiError } from '$lib/services/apiError';
import { getRecipeBySlug } from '$lib/services/recipeService';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
    try {
        const recipe = await getRecipeBySlug(params.slug, fetch);
        console.log(recipe);

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

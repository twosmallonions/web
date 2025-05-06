import { ApiErrorDescription } from '$lib/services/apiError';
import { getRecipe } from '$lib/services/recipeService';
import { error, type RequestHandler } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch, parent }) => {
    const { accessToken } = await parent();
    const recipe = await getRecipe(params.collection_id, params.recipe_id, {accessToken, fetch})
    if (recipe instanceof ApiErrorDescription) {
        error(recipe.statusCode, {message: recipe.humanDescription})
    }

    return {
        recipeProp: recipe
    };
};
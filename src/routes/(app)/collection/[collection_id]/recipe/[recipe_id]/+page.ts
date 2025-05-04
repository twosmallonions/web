import client from '$lib';
import { ApiErrorDescription } from '$lib/services/apiError';
import { getRecipe } from '$lib/services/recipeService';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch, parent }) => {
    const { accessToken } = await parent();
    const authHeader = { authorization: `Bearer ${accessToken}` };
    const recipe = await getRecipe(params.collection_id, params.recipe_id, {accessToken, fetch})
    if (recipe instanceof ApiErrorDescription) {
        error(recipe.statusCode, {message: recipe.humanDescription})
    }

    return {
        recipeProp: recipe
    };
};

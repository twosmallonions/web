import { ApiErrorDescription } from '$lib/services/apiError';
import { getRecipesForUser } from '$lib/services/recipeService';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, parent }) => {
    const { accessToken } = await parent();

    const recipes = await getRecipesForUser({accessToken, fetch})

    if (recipes instanceof ApiErrorDescription) {
        console.error(recipes);
        error(recipes.statusCode, {message: recipes.humanDescription});
    }

    return {
        recipes,
        accessToken
    };
};

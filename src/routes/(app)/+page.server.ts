import { ApiErrorDescription } from '$lib/services/apiError';
import { getRecipesForUser } from '$lib/services/recipeService';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, parent, url }) => {
    const { accessToken } = await parent();

    const sortField = url.searchParams.get('field');
    console.log(sortField)
    console.log(url)

    const recipes = await getRecipesForUser(sortField ?? 'title', {accessToken, fetch})

    if (recipes instanceof ApiErrorDescription) {
        console.error(recipes);
        error(recipes.statusCode, {message: recipes.humanDescription});
    }

    return {
        recipeProps: recipes,
        accessToken
    };
};

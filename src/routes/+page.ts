import { getRecipes } from '$lib/services/recipeService';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, data }) => {
    const recipes = await getRecipes(fetch);
    return {
        user: data.user,
        recipes
    };
};

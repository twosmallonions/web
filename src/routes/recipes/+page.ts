import { getRecipes } from '$lib/services/recipeService';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    const recipes = await getRecipes(fetch);
    return {
        recipes
    };
};

import { getRecipes } from '$lib/services/recipeService';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
    const recipes = await getRecipes(fetch);
    return {
        recipes
    };
};

import client from '$lib';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
    const recipes = await client.GET("/api/recipe/", {fetch});
    
    return {
        data: recipes.data,
        error: recipes.error
    };
};

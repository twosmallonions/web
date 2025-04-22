import client from '$lib';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
    const { session } = await parent();
    const authHeader = { authorization: `Bearer ${session?.accessToken}` };
    const recipes = await client.GET('/api/recipe/', {
        fetch: fetch,
        headers: authHeader,
        credentials: 'omit'
    });

    return {
        recipes: recipes.data,
        error: recipes.error
    };
};

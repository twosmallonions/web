import client from '$lib';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch, parent }) => {
    const { session } = await parent();
    const authHeader = { authorization: `Bearer ${session?.accessToken}` };
    const recipe = await client.GET('/api/recipe/{collection_id}/{recipe_id}', {
        params: {
            path: { collection_id: params.collection_id, recipe_id: params.recipe_id }
        },
        headers: authHeader,
        fetch: fetch
    });
    return {
        recipe: recipe.data,
        error: recipe.error
    };
};

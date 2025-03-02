import type { PageLoad } from '../../$types';
import client from '$lib';

export const load: PageLoad = async ({ params, fetch, parent }) => {
    const { session } = await parent();
    const authHeader = {"authorization": `Bearer ${session?.accessToken}`}
    const recipe = await client.GET("/api/recipe/{slug}", {
        params: {
            path: {slug: params.slug}
        },
        headers: authHeader,
        fetch
    })

    return {
        recipe: recipe.data,
        error: recipe.error
    }
};

import { ApiErrorDescription } from '$lib/services/apiError';
import { getRecipe } from '$lib/services/recipeService';
import { error, fail, json, type RequestHandler } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import RecipeCard from '$lib/components/RecipeCard.svelte';
import { doApiRequest } from '$lib/services/base';
import type { FullRecipe } from '$lib/types/recipe';

export const load: PageServerLoad = async ({ params, fetch, parent }) => {
    const { accessToken } = await parent();
    const recipe = await getRecipe(params.collection_id, params.recipe_id, { accessToken, fetch });
    if (recipe instanceof ApiErrorDescription) {
        error(recipe.statusCode, { message: recipe.humanDescription });
    }

    return {
        recipeProp: recipe
    };
};

export const actions = {
    image: async ({ request, locals, fetch, params }) => {
        const data = await request.formData();
        const file = data.get('image');

        if (!file) {
            return fail(400, {
                error: 'file missing'
            });
        }

        const formData = new FormData();
        formData.set('file', file as File, (file as File).name);

        const res = await doApiRequest<FullRecipe>(
            {
                accessToken: locals.session.accessToken,
                fetch,
                method: 'PUT',
                path: `/api/recipe/${params.collection_id}/${params.recipe_id}/cover`,
                body: formData
            },
            false
        );

        if (res instanceof ApiErrorDescription) {
            return fail(res.statusCode, { error: res.humanDescription });
        }

        return res
    }
};

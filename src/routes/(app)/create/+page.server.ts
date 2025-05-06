import { ApiErrorDescription } from '$lib/services/apiError';
import { getCollections } from '$lib/services/collectionService';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, RequestEvent } from './$types';
import { createRecipe, importRecipe } from '$lib/services/recipeService';

export const load: PageServerLoad = async ({ fetch, locals }) => {
    const collections = await getCollections({ accessToken: locals.session.accessToken, fetch });

    if (collections instanceof ApiErrorDescription) {
        console.log(JSON.stringify(collections.rawError));
        error(collections.statusCode, { message: collections.humanDescription });
    }

    return {
        collections
    };
};

export const actions = {
    import: async ({ request, locals, fetch }) => {
        const data = await request.formData();
        const recipeUrl = data.get('recipeUrl');
        const collectionId = data.get('collectionId');

        if (!recipeUrl) {
            return fail(400, {
                recipeUrl,
                collectionId,
                error: 'Recipe URL missing',
                id: 'import'
            });
        }

        if (!collectionId) {
            return fail(400, {
                recipeUrl,
                collectionId,
                error: 'Collection ID missing',
                id: 'import'
            });
        }

        const newRecipe = await importRecipe(
            { url: recipeUrl.toString() },
            collectionId.toString(),
            {
                accessToken: locals.session.accessToken,
                fetch
            }
        );

        if (newRecipe instanceof ApiErrorDescription) {
            return fail(newRecipe.statusCode, {
                recipeUrl,
                collectionId,
                error: newRecipe.humanDescription,
                id: 'import'
            });
        }

        return redirect(303, `/collection/${newRecipe.collection}/recipe/${newRecipe.id}`);
    },
    create: async ({ request, locals }) => {
        const data = await request.formData();
        const recipeTitle = data.get('recipeTitle');
        const collectionId = data.get('collectionId');

        if (!recipeTitle) {
            return fail(400, {
                recipeTitle,
                collectionId,
                error: 'Recipe Title missing',
                id: 'create'
            });
        }

        if (!collectionId) {
            return fail(400, {
                recipeTitle,
                collectionId,
                error: 'Collection ID missing',
                id: 'create'
            });
        }

        const newRecipe = await createRecipe(
            collectionId.toString(),
            { title: recipeTitle.toString() },
            { accessToken: locals.session.accessToken, fetch }
        );
        if (newRecipe instanceof ApiErrorDescription) {
            return fail(newRecipe.statusCode, {
                recipeTitle,
                collectionId,
                error: newRecipe.humanDescription,
                id: 'create'
            });
        }

        return redirect(303, `/collection/${newRecipe.collection}/recipe/${newRecipe.id}`);
    }
};

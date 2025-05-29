import { ApiErrorDescription } from "$lib/services/apiError";
import { getCollections } from "$lib/services/collectionService";
import { error, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({locals, fetch}) => {
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
    addUser: async({locals, request}) => {
        const data = await request.formData();
        const collectionId = data.get('collectionId');
        const userId = data.get('userId');

        if (!collectionId) {
            return fail(400, {
                collectionId,
                userId,
                error: 'Collection ID missing',
                id: 'addUser'
            });

        }
        if (!userId) {
            return fail(400, {
                collectionId,
                userId,
                error: 'User ID missing',
                id: 'addUser'
            });
        }
    }
}
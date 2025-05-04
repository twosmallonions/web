import client from "$lib";
import { ApiErrorDescription } from "$lib/services/apiError";
import { getCollections } from "$lib/services/collectionService";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, parent }) => {
    const {accessToken} = await parent();
    const collections = await getCollections({accessToken, fetch});
    
    if (collections instanceof ApiErrorDescription) {
        console.log(JSON.stringify(collections.rawError));
        error(collections.statusCode, {message: collections.humanDescription})
    }

    return {
        collections
    }
}; 

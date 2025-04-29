import client from "$lib";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, parent }) => {
    const {accessToken} = await parent();
    const authHeader = {authorization: `Bearer ${accessToken}`}

    const collections = await client.GET('/api/collection/', {
        fetch: fetch,
        headers: authHeader,
        credentials: 'omit'
    });
    
    if (!collections.data) {
        console.log(collections);
        throw new Error('no data')
    }
    
    return {
        collections: collections.data
    }
}; 

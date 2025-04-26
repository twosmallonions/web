import client from "$lib";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, parent }) => {
    const {session} = await parent();
    const authHeader = {authorization: `Bearer ${session?.accessToken}`}

    const collections = await client.GET('/api/collection/', {
        fetch: fetch,
        headers: authHeader,
        credentials: 'omit'
    });
    
    if (!collections.data) {
        throw new Error('no data')
    }
    
    return {
        collections: collections.data
    }
}; 

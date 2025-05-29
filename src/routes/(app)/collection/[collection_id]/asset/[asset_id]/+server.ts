import { API_BASE } from "$lib/services/base";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({params, locals, fetch}) => {
    const assetId = params.asset_id;
    const collectionId = params.collection_id;

    const res = await fetch(API_BASE + `/api/asset/${collectionId}/${assetId}`, {
        headers: { authorization: `Bearer ${locals.session.accessToken}` }
    });

    const contentType = res.headers.get('content-type');
    if (!res.ok) {
        if (contentType && contentType.toLocaleLowerCase() === 'application/json') {
            console.error(await res.json());
        }
        return new Response(null, {status: res.status})
    }

    const headers = new Headers();
    if (contentType) {
        headers.set('content-type', contentType);
    }

    const cacheControl = res.headers.get('cache-control');
    if (cacheControl) {
        headers.set('cache-control', cacheControl);
    }

    return new Response(res.body, {headers});
}
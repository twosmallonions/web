import { getOrRefreshSession } from "$lib/server/oidc";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({cookies}) => {
    const sessionId = cookies.get('__Host-sessionId');
    if (!sessionId) {
        return json({'session': 'no session'});
    }
    return json({'session': await getOrRefreshSession(sessionId)});
}
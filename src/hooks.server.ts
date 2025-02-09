import type { HandleFetch } from "@sveltejs/kit";

export { handle } from "./auth"; 

export const handleFetch: HandleFetch = async({ event, request, fetch }) => {
    const session = await event.locals.auth()

    request.headers.set('authorization', `Bearer ${session?.accessToken}`)

    return fetch(request);
}
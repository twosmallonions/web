import type { Handle, HandleFetch } from '@sveltejs/kit';

//export const handle: Handle = async ({event, resolve}) => {
//    console.log(event);
//}

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
    //request.headers.set('authorization', `Bearer ${session?.accessToken}`);

    return fetch(request);
};

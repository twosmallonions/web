import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    if (event.url.pathname.startsWith('/auth')) {
        return resolve(event);
    }
    const authCookie = event.cookies.get('__Host-SESSION') ?? null;
    if (authCookie === null) {
        redirect(303, '/auth');
    }

    await event
        .fetch('/auth/userinfo')
        .then(async (res) => {
            console.log('first then');
            if (!res.ok) {
                throw new Error(`response not okay: ${res.status}`);
            }
            event.locals.user = await res.json();
        })
        .catch((e) => {
            console.log('catch');
            event.cookies.delete('__HOST-SESSION', { path: '/' });
            console.log(e);
            redirect(303, '/auth');
        });

    const response = await resolve(event);

    return response;
};

import { error, redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    if (event.url.pathname.startsWith('/auth')) {
        return resolve(event);
    }
    const authCookie = event.cookies.get('__Host-SESSION') ?? null;
    if (authCookie === null) {
        return redirect(303, '/auth');
    }

    await event
        .fetch('/auth/userinfo')
        .then((res) => {
            if (!res.ok) {
                error(500, {
                    message: 'Something went wrong...'
                });
            }
            return res.json();
        })
        .then((body) => {
            event.locals.user = body;
        })
        .catch((e) => {
            console.log(e);
            error(500, { message: 'Something went wrong...' });
        });

    const response = await resolve(event);

    return response;
};

import { redirect, type Handle } from '@sveltejs/kit';
import { handle as authenticationHandle } from './auth';
import { sequence } from '@sveltejs/kit/hooks';

const authorizationHandle: Handle = async ({ event, resolve }) => {
    console.log(event.url.pathname);
    if (
        event.url.pathname.startsWith('/auth') ||
        event.url.pathname.startsWith('/signin') ||
        event.url.pathname.startsWith('/api')
    ) {
        return resolve(event);
    }
    const session = await event.locals.auth();

    if (!session || session.error) {
        throw redirect(303, '/signin');
    }

    return resolve(event);
};

const openapiFetchfilterSerializedResponseHeaders: Handle = async ({ event, resolve }) => {
    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === 'content-length';
        }
    });
};

export const handle: Handle = sequence(
    authenticationHandle,
    authorizationHandle,
    openapiFetchfilterSerializedResponseHeaders
);

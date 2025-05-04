import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { getDbConnection, migration } from '$lib/server/db';
import { getOrRefreshSession, getSessionId, setSessionCookie } from '$lib/server/oidc';

const conn = await getDbConnection()
await conn.query(migration);
conn.release()

const authorizationHandle: Handle = async ({ event, resolve }) => {
    if (
        event.url.pathname.startsWith('/oidc') ||
        event.url.pathname.startsWith('/api')
    ) {
        return resolve(event);
    }

    const sessionId = getSessionId(event.cookies);
    if (!sessionId) {
        redirect(302, '/oidc/auth');
    }

    const session = await getOrRefreshSession(sessionId);
    if (!session) {
        event.cookies.delete('sessionId', {path: '/'});
        redirect(302, '/oidc/auth')
    }

    if (session.refreshed) {
        setSessionCookie(session, event.cookies);
    }


    event.locals.session = session

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
    authorizationHandle,
    openapiFetchfilterSerializedResponseHeaders
);

import { newSession } from "$lib/server/oidc";
import { json, type RequestHandler } from "@sveltejs/kit";

import { Temporal } from "temporal-polyfill";

export const GET: RequestHandler = async ({ url, cookies }) => {
    const session = await newSession(url);
    cookies.set('__Host-sessionId', session.sessionId, {
        path: '/',
        secure: true,
        maxAge: Math.floor(session.refreshExpiresAt.since(Temporal.Now.instant()).total('seconds')),
        httpOnly: true,
        sameSite: 'lax'
        
    })
    return json({session: session});
}
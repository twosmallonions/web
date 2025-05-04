import { newSession, setSessionCookie } from "$lib/server/oidc";
import { redirect, type RequestHandler } from "@sveltejs/kit";


export const GET: RequestHandler = async ({ url, cookies }) => {
    const session = await newSession(url);

    setSessionCookie(session, cookies)
    return redirect(302, '/') 
}
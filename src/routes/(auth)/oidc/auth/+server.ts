import { genAuthorizationUrl } from "$lib/server/oidc";
import { redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (event) => {
    return redirect(302, await genAuthorizationUrl(event.url.origin));
}

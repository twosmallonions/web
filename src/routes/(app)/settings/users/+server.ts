import { searchUsers } from '$lib/services/userService';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, url, fetch }) => {
    let search = url.searchParams.get('search');
    let limit = parseInt(url.searchParams.get('limit') ?? '50');
    let excludeSelf = (url.searchParams.get('exclude_self') ?? 'true') === 'true';
    let users = await searchUsers(excludeSelf.valueOf(), search, limit, {
        accessToken: locals.session.accessToken,
        fetch
    });

    console.log(users)

    return json(users)
};

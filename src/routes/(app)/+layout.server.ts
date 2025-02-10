import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
    const session = await event.locals.auth();
    console.log(`access token is: ${session?.accessToken}`);
    if (!session?.user) {
        redirect(307, `/signin`);
    }

    return {
        session
    };
};

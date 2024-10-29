import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
    const parentData = await parent();

    return {
        recipe: parentData.recipe
    };
};

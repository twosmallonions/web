import { ApiErrorDescription } from "$lib/services/apiError";
import { updateRecipe } from "$lib/services/recipeService";
import type { RecipeUpdate } from "$lib/types/recipe";
import { error, json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

export const PUT: RequestHandler = async ({request, params, locals, fetch}) => {
    const body: RecipeUpdate  = await request.json();
    const res = await updateRecipe(body, params.recipe_id, params.collection_id, {accessToken: locals.session.accessToken, fetch})

    if (res instanceof ApiErrorDescription) {
        return error(res.statusCode, {message: res.humanDescription})
        
    }
    return json(res);
}
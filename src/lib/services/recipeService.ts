import type { FullRecipe, RecipeListEntry } from '$lib/types/recipe';
import { ApiError } from './apiError';

export const getRecipes = async (
    fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>
) => {
    const resp = await fetch('/api/recipe/');
    if (!resp.ok) {
        console.log(`failed to fetch recipes: ${resp.status}\n${await resp.text()}`);
        return [];
    }
    const recipes: RecipeListEntry[] = await resp.json();

    return recipes;
};

export const likeRecipeRequest = async (
    id: string,
    fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>
) => {
    const resp = await fetch(`/api/recipe/${id}/like`, { method: 'PUT' });
    const recipe: FullRecipe = await resp.json();

    return recipe;
};

export const createRecipeRequest = async (
    title: string,
    fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>
) => {
    const resp = await fetch(`/api/recipe/`, {
        method: 'POST',
        body: JSON.stringify({ title }),
        headers: {
            'Content-Type': 'application/json'
        },
        
    });

    const recipe: FullRecipe = await resp.json();

    return recipe;
};

export const getRecipeBySlug = async (
    slug: string,
    fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>
) => {
    const resp = await fetch(`/api/recipe/${slug}`);

    if (!resp.ok) {
        throw new ApiError("Oops... we can' find that recipe.", resp.status);
    }

    const recipe: FullRecipe = await resp.json();

    return recipe;
};

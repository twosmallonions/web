import type { components } from './openapi';

export type RecipeLight = components['schemas']['RecipeLight'];

export interface FullRecipe {
    title: string;
    description?: string;
    cookTime?: number;
    prepTime?: number;
    recipeYield?: string;
    liked: boolean;
    id: string;
    owner: string;
    slug: string;
    totalTime?: number;
    lastMade?: Date;
    instructions: Instruction[];
    ingredients: Ingredient[];
    coverImage?: string;
    coverThumbnail?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Ingredient {
    id: string;
    text: string;
}

export interface Instruction {
    id: string;
    text: string;
}

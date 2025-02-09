export interface RecipeListEntry {
    id: string;
    subject: string;
    slug: string;
    title: string;
    description?: string;
    original_url?: string;
    added: Date;
    modified: Date;
    liked: boolean;
}

export interface FullRecipe {
    subject: string;
    slug: string;
    title: string;
    description: string;
    servings: string;
    originalUrl: string;
    added: Date;
    modified: Date;
    lastMade: Date;
    prepTime: number;
    cookTime: number;
    restTime: number;
    totalTime: number;
    liked: boolean;
    note: string;
    id: string;
    ingredients: Ingredient[];
    instructions: Instruction[];
    coverImage: string[];
}

export interface Ingredient {
    id: string;
    description: string;
    heading: boolean;
}

export interface Instruction {
    id: string;
    description: string;
    heading: boolean;
}

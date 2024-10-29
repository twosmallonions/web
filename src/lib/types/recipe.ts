export interface Recipe {
    id: string;
    title: string;
    description: string;
    note: string;
    liked: boolean;
    slug: string;
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
    prepTime: number;
    cookTime: number;
    restTime: number;
    totalTime: number;
    note: string;
    id: string;
    ingredients: Ingredient[];
    steps: Step[];
    coverImage: string[];
}

export interface Ingredient {
    id: string;
    notes: string;
    heading: boolean;
}

export interface Step {
    id: string;
    description: string;
    heading: boolean;
    linkedIngredients: StepIngredient[];
}

export interface StepIngredient {
    ingredientId: string;
}

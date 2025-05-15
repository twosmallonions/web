import type { components } from './openapi';

export type FullRecipe = components['schemas']['RecipeFull']
export type RecipeLight = components['schemas']['ListResponse_RecipeLight_']
export type RecipeCreate = components['schemas']['RecipeCreate']
export type RecipeImport = components['schemas']['ImportRecipe']
export type RecipeUpdate = components['schemas']['RecipeUpdate']
export type Instruction = components['schemas']['Instruction']
export type Ingredient = components['schemas']['Ingredient']

export function mapRecipeFullToRecipeUpdate(recipe: FullRecipe): RecipeUpdate {
    return {
        ...recipe
    }
}

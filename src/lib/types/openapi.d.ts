/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/api/recipe/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Recipe By Slug */
        get: operations["get_recipe_by_slug_api_recipe__slug__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/recipe/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Recipes By Owner */
        get: operations["get_recipes_by_owner_api_recipe__get"];
        put?: never;
        /** Create Recipe */
        post: operations["create_recipe_api_recipe__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/recipe/{recipe_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Get Recipe By Id */
        post: operations["get_recipe_by_id_api_recipe__recipe_id__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/recipe/{recipe_id}/cover": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Add Cover Image To Recipe */
        post: operations["add_cover_image_to_recipe_api_recipe__recipe_id__cover_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/recipe/asset/{asset_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Asset */
        get: operations["get_asset_api_recipe_asset__asset_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** Body_add_cover_image_to_recipe_api_recipe__recipe_id__cover_post */
        Body_add_cover_image_to_recipe_api_recipe__recipe_id__cover_post: {
            /**
             * File
             * Format: binary
             */
            file: string;
        };
        /** HTTPValidationError */
        HTTPValidationError: {
            /** Detail */
            detail?: components["schemas"]["ValidationError"][];
        };
        /** Ingredient */
        Ingredient: {
            /** Text */
            text: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
        };
        /** Instruction */
        Instruction: {
            /** Text */
            text: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
        };
        /** RecipeCreate */
        RecipeCreate: {
            /** Title */
            title: string;
            /** Description */
            description?: string | null;
            /** Cooktime */
            cookTime?: number | null;
            /** Preptime */
            prepTime?: number | null;
            /** Recipeyield */
            recipeYield?: string | null;
            /**
             * Liked
             * @default false
             */
            liked: boolean;
            /** Instructions */
            instructions?: string[];
            /** Ingredients */
            ingredients?: string[];
        };
        /** RecipeFull */
        RecipeFull: {
            /**
             * Createdat
             * Format: date-time
             */
            createdAt: string;
            /**
             * Updatedat
             * Format: date-time
             */
            updatedAt: string;
            /** Title */
            title: string;
            /** Description */
            description?: string | null;
            /** Cooktime */
            cookTime?: number | null;
            /** Preptime */
            prepTime?: number | null;
            /** Recipeyield */
            recipeYield?: string | null;
            /**
             * Liked
             * @default false
             */
            liked: boolean;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Owner */
            owner: string;
            /** Slug */
            slug: string;
            /** Totaltime */
            totalTime?: number | null;
            /** Lastmade */
            lastMade: string | null;
            /** Instructions */
            instructions?: components["schemas"]["Instruction"][];
            /** Ingredients */
            ingredients?: components["schemas"]["Ingredient"][];
            /** Coverimage */
            coverImage?: string | null;
            /** Coverthumbnail */
            coverThumbnail?: string | null;
        };
        /** RecipeLight */
        RecipeLight: {
            /**
             * Createdat
             * Format: date-time
             */
            createdAt: string;
            /**
             * Updatedat
             * Format: date-time
             */
            updatedAt: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Owner */
            owner: string;
            /** Slug */
            slug: string;
            /** Title */
            title: string;
            /** Description */
            description: string | null;
            /** Liked */
            liked: boolean;
        };
        /** ValidationError */
        ValidationError: {
            /** Location */
            loc: (string | number)[];
            /** Message */
            msg: string;
            /** Error Type */
            type: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    get_recipe_by_slug_api_recipe__slug__get: {
        parameters: {
            query?: never;
            header?: {
                authorization?: string | null;
            };
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecipeFull"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_recipes_by_owner_api_recipe__get: {
        parameters: {
            query?: never;
            header?: {
                authorization?: string | null;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecipeLight"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_recipe_api_recipe__post: {
        parameters: {
            query?: never;
            header?: {
                authorization?: string | null;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecipeCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecipeFull"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_recipe_by_id_api_recipe__recipe_id__post: {
        parameters: {
            query?: never;
            header?: {
                authorization?: string | null;
            };
            path: {
                recipe_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecipeFull"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    add_cover_image_to_recipe_api_recipe__recipe_id__cover_post: {
        parameters: {
            query?: never;
            header?: {
                authorization?: string | null;
            };
            path: {
                recipe_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["Body_add_cover_image_to_recipe_api_recipe__recipe_id__cover_post"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_asset_api_recipe_asset__asset_id__get: {
        parameters: {
            query?: never;
            header?: {
                authorization?: string | null;
            };
            path: {
                asset_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
}

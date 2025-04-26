<script lang="ts">
    import { likeRecipeRequest } from '$lib/services/recipeService';
    import type { RecipeLight } from '$lib/types/recipe';
    import { Heart } from '@lucide/svelte';

    export const likeRecipe = async () => {
        liked = !liked;
        await likeRecipeRequest(recipe.id, fetch);
    };

    let { recipe }: { recipe: RecipeLight } = $props();
    let liked = $state(recipe.liked);
</script>

<a class="card w-96 bg-base-300 shadow-xl" href={`/collection/${recipe.collection}/recipe/${recipe.id}`}>
    <figure>
        <img src="https://placehold.co/600x400" alt="placeholder" />
    </figure>
    <div class="card-body">
        <h2 class="card-title">
            {recipe.title}
        </h2>
        <p class="truncate">{recipe.description ? recipe.description : ''}</p>
        <div class="card-actions justify-between">
            <button
                onclickcapture={(e) => {
                    e.preventDefault();
                    likeRecipe();
                }}
                class="rounded-full"
            >
                <div class="transition-colors duration-100 hover:[&>svg]:text-red-500">
                    <Heart
                        color={liked ? '#ef4444' : 'currentColor'}
                        fill={liked ? '#ef4444' : 'transparent'}
                        class="transition-colors duration-200"
                    />
                </div>
            </button>
            <div class="badge badge-outline">test</div>
        </div>
    </div>
</a>

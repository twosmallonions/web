<script lang="ts">
    import type { RecipeLight } from '$lib/types/recipe';
    import { Heart } from '@lucide/svelte';

    import recipePlaceholder from '$lib/assets/recipePlaceholder.jpg';
    export const likeRecipe = async () => {
        liked = !liked;
    };

    let coverImageUrl = $state('');

    let { recipe }: { recipe: RecipeLight } = $props();
    let liked = $state(recipe.liked);
</script>

<a
    class="card bg-base-300 w-full shadow-xl"
    href={`/collection/${recipe.collection}/recipe/${recipe.id}`}
>
    <figure>
        {#if recipe.coverThumbnail}
            <img
                src={`/collection/${recipe.collection}/asset/${recipe.coverThumbnail}`}
                alt=""
                class="aspect-square w-full rounded-md"
            />
        {:else}
            <img src={recipePlaceholder} alt="" />
        {/if}
    </figure>
    <div class="card-body">
        <h2 class="card-title text-left">
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

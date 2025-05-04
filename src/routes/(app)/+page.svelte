<script lang="ts">
    import RecipeCard from '$lib/components/RecipeCard.svelte';

    let { data } = $props();
    let { recipes, accessToken } = data;
</script>

<div class="max-w-[100rem] px-4 py-8 text-center">
    <div class="mb-16">
        <h1 class="mb-4 text-4xl font-bold">Welcome</h1>
        <p class="text-base-content/70 text-2xl">What do you want to cook today?</p>
    </div>
    {#if recipes.length > 0}
        <section class="mb-16">
            <h2 class="mb-6 text-2xl font-semibold">Recipe Ideas for You</h2>
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {#each recipes as recipe (recipe.id)}
                    <RecipeCard {recipe} {accessToken} />
                {/each}
            </div>
        </section>
    {:else}
        <p class="text-base-content/70 italic">It looks like you don't have any recipes yet...</p>
    {/if}
</div>

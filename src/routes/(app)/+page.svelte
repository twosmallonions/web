<script lang="ts">
    import RecipeCard from '$lib/components/RecipeCard.svelte';

    let { data } = $props();
    let { recipes, error } = data;
    let featuredRecipes =
        recipes.length <= 3
            ? [...recipes]
            : data.recipes.sort(() => Math.random() - 0.5).slice(0, 3);
</script>

<div class="mx-auto max-w-7xl px-4 py-8"> 
    <div class="mb-16 text-center">
        <h1 class="mb-4 text-4xl font-bold">Welcome</h1>
        <p class="text-2xl text-base-content/70">What do you want to cook today?</p>
    </div>

    {#if recipes.length > 0}
        <section class="mb-16">
            <h2 class="mb-6 text-2xl font-semibold">Recipe Ideas for You</h2>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {#each featuredRecipes as recipe (recipe.id)}
                    <RecipeCard {recipe} />
                {/each}
            </div>
        </section>
    {:else}
        <h2>It looks like you don't have any recipes yet...</h2>
    {/if}
</div>

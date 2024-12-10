<script lang="ts">
    import RecipeCard from '$lib/components/RecipeCard.svelte';

    let { data } = $props();
    let { recipes } = data;
</script>

<div class="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {#each recipes as recipe (recipe.id)}
        <RecipeCard {recipe} />
    {/each}
</div>

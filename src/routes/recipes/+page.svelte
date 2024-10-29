<script lang="ts">
    import RecipeCard from "$lib/components/RecipeCard.svelte";

    let { data } = $props();
    let { recipes } = data;
</script>

<div class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8">
    {#each recipes as recipe}
        <RecipeCard {recipe} />
    {/each}
</div>
<script lang="ts">
    import NewRecipe from '$lib/components/create/NewRecipe.svelte';
    import ImportRecipe from '$lib/components/create/ImportRecipe.svelte';

    let { data, form } = $props();
    let { collections } = data;
</script>

<div class="w-[90%] xl:w-5xl">
    <!-- Header Section -->
    <div class="mb-12 text-center">
        <h1 class="mb-2 text-2xl font-bold md:text-3xl">Add New Recipe</h1>
        <p class="text-base-content/70">Choose how you'd like to create your recipe</p>
    </div>

    <div class="mx-auto space-y-8">
        <ImportRecipe {collections} error={form?.id === 'import' ? form.error : undefined} />
        <div class="divider">OR</div>
        <NewRecipe {collections} error={form?.id === 'create' ? form.error : undefined} />
    </div>
</div>

<script lang="ts">
    import { goto } from '$app/navigation';
    import client from '$lib';
    import { error } from '@sveltejs/kit';
    import {createRecipe as serviceCreateRecipe} from '$lib/services/recipeService'
    import { ApiErrorDescription } from '$lib/services/apiError.js';
    import NewRecipe from '$lib/components/create/NewRecipe.svelte';
    import ImportRecipe from '$lib/components/create/ImportRecipe.svelte';

    let { data } = $props();
    let { collections, accessToken } = data;



</script>

<div class="min-h-screen p-4 md:p-8 xl:w-5xl w-[90%]">
    <!-- Header Section -->
    <div class="mb-12 text-center">
        <h1 class="mb-2 text-2xl font-bold md:text-3xl">Add New Recipe</h1>
        <p class="text-base-content/70">Choose how you'd like to create your recipe</p>
    </div>

    <div class="mx-auto space-y-8">
        <ImportRecipe {accessToken} {collections}/>
        <div class="divider text-base-content/50">OR</div>
        <NewRecipe {accessToken} {collections} />
    </div>
</div>

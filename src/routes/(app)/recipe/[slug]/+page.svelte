<script lang="ts">
    const { data } = $props();
    const { recipe } = data;

    import Ingredients from '$lib/components/recipe/Ingredients.svelte';
    import MetaInfo from '$lib/components/recipe/MetaInfo.svelte';
    import type { Ingredient, Instruction } from '$lib/types/recipe.js';
    import { convertMinutes } from '$lib/util.js';
    import {
        CalendarClockIcon,
        CalendarPlusIcon,
        ClockIcon,
        CookingPotIcon,
        ExternalLinkIcon,
        PencilIcon,
        UtensilsCrossedIcon,
        ChevronDown,
        ChevronUp,
        Carrot
    } from 'lucide-svelte';
    import Instructions from '$lib/components/recipe/Instructions.svelte';

    let isRecipeDescriptionExpanded = $state(false);
    let maxDescriptionLength = 300;
    let truncatedDescription = $derived(
        recipe.description.length > maxDescriptionLength && !isRecipeDescriptionExpanded
            ? recipe.description.slice(0, maxDescriptionLength) + '…'
            : recipe.description
    );

    let edit = $state(false);

    const updatedRecipe = $state(structuredClone(recipe));

    let targetRecipe = $derived(edit ? updatedRecipe : recipe);

    const deleteIngredient = (index: number) => {
        updatedRecipe.ingredients = [
            ...updatedRecipe.ingredients.slice(0, index),
            ...updatedRecipe.ingredients.slice(index + 1)
        ];
    };

    const addIngredient = () => {
        updatedRecipe.ingredients.push({
            id: `temp-${Math.floor(Math.random() * 50)}`,
            description: ''
        });
    };

    const sortIngredients = (ids: string[]) => {
        const ingredientMap = new Map(
            updatedRecipe.ingredients.map((ingredient) => [ingredient.id, ingredient])
        );
        updatedRecipe.ingredients = ids
            .map((id) => ingredientMap.get(id))
            .filter((ingredient): ingredient is Ingredient => ingredient !== undefined);
    };

    const deleteInstruction = (index: number) => {
        updatedRecipe.instructions = [
            ...updatedRecipe.instructions.slice(0, index),
            ...updatedRecipe.instructions.slice(index + 1)
        ];
    };

    const addInstruction = () => {
        updatedRecipe.instructions.push({
            heading: false,
            id: `temp-${Math.floor(Math.random() * 50)}`,
            description: ''
        });
    };

    const sortInstruction = (ids: string[]) => {
        const ingredientMap = new Map(
            updatedRecipe.instructions.map((instruction) => [instruction.id, instruction])
        );
        updatedRecipe.instructions = ids
            .map((id) => ingredientMap.get(id))
            .filter((instruction): instruction is Instruction => instruction !== undefined);
    };
</script>

<div class="container mx-auto md:px-4 md:py-8">
    <!-- Recipe Header -->

    <header class="mb-2">
        <div class="mb-6 flex items-start justify-between gap-3">
            {@render recipeTitle()}
            {@render editSaveButton()}
        </div>

        <div>
            {@render description()}
        </div>
        <!-- TODO: make this nicer -->
        <div class="block gap-2 sm:grid sm:grid-cols-3">
            <div class="sm:col-span-2">
                <!-- Recipe Meta Info -->
                <div class="mb-6 flex gap-2">
                    {#if recipe.recipeYield}
                        <div class="h-24 min-w-60">{@render metaInfoServings()}</div>
                    {/if}
                    {#if recipe.totalTime}
                        <div class="h-24 min-w-60">{@render metaInfoPrepTime()}</div>
                    {/if}
                </div>
                {#if false}
                    {@render originalUrl()}
                {/if}
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- Ingredients Column -->
        <div class="lg:col-span-1">
            <div class="sticky top-4">
                <Ingredients
                    ingredients={targetRecipe.ingredients}
                    {deleteIngredient}
                    {edit}
                    {addIngredient}
                    {sortIngredients}
                />
            </div>
        </div>

        <!-- Steps Column -->
        <div class="lg:col-span-2">
            <Instructions
                instructions={targetRecipe.instructions}
                {edit}
                {deleteInstruction}
                {addInstruction}
                {sortInstruction}
            />
        </div>
    </div>

    <!-- Footer Meta -->
    <footer class="mt-12 border-t border-base-300 pt-6 text-sm text-base-content/60">
        <div class="flex flex-wrap gap-x-6 gap-y-2">
            <div
                class="tooltip flex items-center gap-2"
                data-tip={() => new Date(recipe.createdAt).toLocaleTimeString}
            >
                <CalendarPlusIcon class="h-4 w-4" />
                Added: {new Date(recipe.added).toLocaleDateString()}
            </div>
            <div class="flex items-center gap-2">
                <CalendarClockIcon class="h-4 w-4" />
                Last modified: {new Date(recipe.modified).toLocaleDateString()}
            </div>
        </div>
    </footer>
</div>

{#snippet editSaveButton()}
    <button class="btn btn-ghost" onclick={() => (edit = !edit)}>
        <PencilIcon class="mr-2 h-5 w-5" />

        {edit ? 'Save Recipe' : 'Edit Recipe'}
    </button>
{/snippet}

{#snippet recipeTitle()}
    {#if edit}
        <input
            type="text"
            class="input input-bordered w-full text-4xl font-bold"
            bind:value={updatedRecipe.title}
        />
    {:else}
        <h1 class="text-4xl font-bold">{recipe.title}</h1>
    {/if}
{/snippet}

{#snippet description()}
    <div class="prose mb-8 max-w-none">
        {#if edit}
            <textarea
                class="textarea textarea-bordered w-full"
                bind:value={updatedRecipe.description}
                rows="5"
            ></textarea>
        {:else}
            {#if truncatedDescription}
                {truncatedDescription}
            {:else}
                <span class="font-light italic text-slate-300">No description...</span>
            {/if}
            <p>{truncatedDescription}</p>
            {#if recipe.description.length > maxDescriptionLength}
                <button
                    class="text-base-400 mt-2 flex items-center gap-1 text-sm hover:text-base-content"
                    onclick={() => (isRecipeDescriptionExpanded = !isRecipeDescriptionExpanded)}
                >
                    <span>{isRecipeDescriptionExpanded ? 'Show less' : 'Show more'}</span>
                    {#if isRecipeDescriptionExpanded}
                        <ChevronUp />
                    {:else}
                        <ChevronDown />
                    {/if}
                </button>
            {/if}
        {/if}
    </div>
{/snippet}

{#snippet metaInfoServings()}
    <MetaInfo
        title="Servings"
        value={targetRecipe.servings}
        StatIcon={UtensilsCrossedIcon}
        {edit}
    />
{/snippet}

{#snippet metaInfoPrepTime()}
    <MetaInfo
        title="Prep time"
        value={convertMinutes(targetRecipe.prepTime)}
        StatIcon={Carrot}
        {edit}
    />
    <MetaInfo
        title="Cook Time"
        value={`${targetRecipe.cookTime} min`}
        StatIcon={CookingPotIcon}
        {edit}
    />
    <MetaInfo
        title="Total Time"
        value={`${targetRecipe.totalTime} min`}
        StatIcon={ClockIcon}
        {edit}
    />
{/snippet}

{#snippet originalUrl()}
    <div class="flex items-center gap-2 text-sm">
        <ExternalLinkIcon class="h-4 w-4" />
        <span class="font-medium">Original Recipe:</span>
        <a
            href={recipe.originalUrl}
            class="link link-primary"
            target="_blank"
            rel="noopener noreferrer nofollow"
        >
            {recipe.originalUrl}
        </a>
    </div>
{/snippet}

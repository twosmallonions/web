<script lang="ts">
    import type { FullRecipe, Ingredient, Step } from '$lib/types/recipe.js';
    import Sortable from 'sortablejs';
    import { onMount } from 'svelte';

    import {
        CalendarClockIcon,
        CalendarPlusIcon,
        ClockIcon,
        CookingPotIcon,
        ExternalLinkIcon,
        ListIcon,
        ScrollTextIcon,
        TimerIcon,
        UsersIcon,
        UtensilsCrossedIcon,
        Save,
        Plus,
        Trash2,
        GripVertical
    } from 'lucide-svelte';

    const dragAnimationDuration = 150;

    const { data } = $props();
    const { recipeSlug, recipe } = data;

    let ingredients: HTMLElement;
    let stepElements: HTMLElement;

    let updatedRecipe: FullRecipe = $state(structuredClone(recipe));
    const removeStep = (index: number) => {
        updatedRecipe.steps = [
            ...updatedRecipe.steps.slice(0, index),
            ...updatedRecipe.steps.slice(index + 1)
        ];
    };

    onMount(async () => {
        let ingredientsSortable = Sortable.create(ingredients, {
            animation: dragAnimationDuration,
            group: 'ingredients',
            handle: '#ingredient-handle',
            dataIdAttr: 'data-id',
            onSort() {
                const ingredientMap = new Map(
                    updatedRecipe.ingredients.map((ingredient) => [ingredient.id, ingredient])
                );
                updatedRecipe.ingredients = ingredientsSortable
                    .toArray()
                    .map((id) => ingredientMap.get(id))
                    .filter((ingredient): ingredient is Ingredient => ingredient !== undefined);
            }
        });

        let stepsSortable = Sortable.create(stepElements, {
            animation: dragAnimationDuration,
            group: 'steps',
            handle: '#step-handle',
            dataIdAttr: 'data-id',
            onSort() {
                const stepsMap = new Map(updatedRecipe.steps.map((step) => [step.id, step]));
                updatedRecipe.steps = stepsSortable
                    .toArray()
                    .map((id) => stepsMap.get(id))
                    .filter((ingredient): ingredient is Step => ingredient !== undefined);
            }
        });
    });
</script>

<div class="container mx-auto md:px-4 md:py-8">
    <!-- Recipe Header -->

    <div class="block sm:hidden">
        {#if recipe.coverImage && recipe.coverImage.length > 0}
            {@render coverImage()}
        {/if}
    </div>
    <header class="mb-2">
        <div class="mb-6 flex items-start justify-between">
            <input
                type="text"
                class="input input-bordered w-full text-4xl font-bold"
                bind:value={updatedRecipe.title}
            />
            <a href="/recipe/{recipeSlug}/edit" class="btn btn-outline btn-primary">
                <Save class="mr-2 h-5 w-5" />
                Save Recipe
            </a>
        </div>

        <div class="block gap-2 sm:grid sm:grid-cols-3">
            <div class="sm:col-span-2">
                {@render description()}
                <!-- Recipe Meta Info -->
                <div class="mb-6 flex gap-2">
                    <div class="h-24 min-w-60">{@render metaInfoServings()}</div>
                    <div class="h-24 min-w-60">{@render metaInfoPrepTime()}</div>
                </div>
                {#if recipe.originalUrl}
                    {@render originalUrl()}
                {/if}
            </div>
            <div class="hidden sm:block">
                {#if recipe.coverImage && recipe.coverImage.length > 0}
                    {@render coverImage()}
                {/if}
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- Ingredients Column -->
        <div class="lg:col-span-1">
            <div class="sticky top-4">
                <h2 class="mb-2 flex place-content-between items-center">
                    <div class="flex items-center gap-2">
                        <ListIcon />
                        <span class="text-2xl font-semibold">Ingredients</span>
                    </div>

                    <button
                        onclick={() =>
                            (updatedRecipe.ingredients = [
                                ...updatedRecipe.ingredients,
                                {
                                    heading: false,
                                    id: `new-${updatedRecipe.ingredients.length}`,
                                    notes: ''
                                }
                            ])}
                    >
                        <Plus />
                    </button>
                </h2>
                <div bind:this={ingredients}>
                    {#each updatedRecipe.ingredients as ingredient, index (ingredient.id)}
                        {#if ingredient.heading}
                            <h3 class="mt-8 text-xl font-semibold first:mt-0">
                                {ingredient.notes}
                            </h3>
                        {:else}
                            <div
                                data-id={ingredient.id}
                                class="z-10 flex cursor-pointer flex-row gap-2 rounded-2xl p-3 pl-4 text-left"
                            >
                                <label class="input input-bordered flex w-full items-center gap-2">
                                    <button id="ingredient-handle">
                                        <GripVertical />
                                    </button>
                                    <input type="text" class="grow" bind:value={ingredient.notes} />
                                    <button
                                        class="text-red-500 hover:text-red-700"
                                        onclick={() =>
                                            (updatedRecipe.ingredients = [
                                                ...updatedRecipe.ingredients.slice(0, index),
                                                ...updatedRecipe.ingredients.slice(index + 1)
                                            ])}
                                    >
                                        <Trash2 />
                                    </button>
                                </label>
                            </div>
                        {/if}
                    {/each}
                </div>

                <div class="flex place-content-center"></div>
            </div>
        </div>

        <!-- Steps Column -->
        <div class="lg:col-span-2">
            <h2 class="mb-4 flex items-center gap-2 text-2xl font-semibold">
                <ScrollTextIcon class="h-6 w-6" />
                Instructions
            </h2>
            <div class="space-y-6" bind:this={stepElements}>
                {#each updatedRecipe.steps as step, index (step.id)}
                    {#if step.heading}
                        <h3 class="mt-8 text-xl font-semibold first:mt-0">{step.description}</h3>
                    {:else}
                        <div class="collapse collapse-arrow bg-base-200" data-id={step.id}>
                            <input type="checkbox" checked={true} />
                            <div class="collapse-title">
                                <div class="flex place-content-between">
                                    <div class="z-50 flex gap-3">
                                        <button id="step-handle" class="z-50">
                                            <GripVertical />
                                        </button>
                                        <h4 class="card-title">Step {index + 1}</h4>
                                    </div>
                                    <button
                                        class="z-50 text-red-500 hover:text-red-700"
                                        onclick={() => removeStep(index)}><Trash2 /></button
                                    >
                                </div>
                            </div>
                            <div class="collapse-content">
                                <textarea
                                    bind:value={step.description}
                                    class="textarea textarea-bordered w-full"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    </div>

    <!-- Footer Meta -->
    <footer class="mt-12 border-t border-base-300 pt-6 text-sm text-base-content/60">
        <div class="flex flex-wrap gap-x-6 gap-y-2">
            <div class="flex items-center gap-2">
                <CalendarPlusIcon class="h-4 w-4" />
                Added: {new Date(recipe.added).toLocaleDateString()}
            </div>
            <div class="flex items-center gap-2">
                <CalendarClockIcon class="h-4 w-4" />
                Last modified: {new Date(recipe.modified).toLocaleDateString()}
            </div>
            <div class="flex items-center gap-2">
                <ExternalLinkIcon class="h-4 w-4" />
                <a href={recipe.originalUrl} target="_blank">Original Recipe</a>
            </div>
        </div>
    </footer>
</div>

{#snippet coverImage()}
    <div class="max-h-128 overflow-hidden rounded-lg">
        <picture class="object-cover object-top">
            {#each recipe.coverImage as url}
                {@const extension = url.split('.').pop().split('?')[0].toLowerCase()}
                {#if extension === 'avif'}
                    <source srcset={url} type="image/avif" />
                {:else if extension === 'webp'}
                    <source srcset={url} type="image/webp" />
                {:else}
                    <img src={url} alt={recipe.title} loading="eager" />
                {/if}
            {/each}
        </picture>
    </div>
{/snippet}

{#snippet description()}
    <div class="prose mb-8 max-w-none">
        <textarea class="textarea textarea-bordered w-full" bind:value={updatedRecipe.description}
        ></textarea>
    </div>
{/snippet}

{#snippet metaInfoServings()}
    <div class="stat h-full rounded-lg bg-base-200 p-4">
        <div class="stat-title flex items-center gap-2">
            <UsersIcon class="h-4 w-4" />
            Servings
        </div>
        <!-- <div class="stat-value text-2xl">{recipe.servings}</div> -->
        <input
            type="text"
            class="input w-full text-2xl font-bold"
            bind:value={updatedRecipe.servings}
        />
    </div>
{/snippet}

{#snippet metaInfoPrepTime()}
    <div class="stat h-full rounded-lg bg-base-200 p-4">
        <div class="stat-title flex items-center gap-2">
            <ClockIcon class="h-4 w-4" />
            Total Time
        </div>
        <div class="stat-value text-2xl">{recipe.totalTime} min</div>
        <div class="stat-desc space-x-2">
            {#if recipe.prepTime}
                <span class="inline-flex items-center">
                    <UtensilsCrossedIcon class="mr-1 h-3 w-3" />
                    Prep: {recipe.prepTime} min
                </span>
            {/if}
            {#if recipe.cookTime}
                <span class="inline-flex items-center">
                    <CookingPotIcon class="mr-1 h-3 w-3" />
                    Cook: {recipe.cookTime} min
                </span>
            {/if}
            {#if recipe.restTime}
                <span class="inline-flex items-center">
                    <TimerIcon class="mr-1 h-3 w-3" />
                    Rest: {recipe.restTime} min
                </span>
            {/if}
        </div>
    </div>
{/snippet}

{#snippet originalUrl()}
    <div class="flex items-center gap-2 text-sm">
        <ExternalLinkIcon class="h-4 w-4" />
        <span class="font-medium">Original Recipe:</span>
        <a
            href={recipe.originalUrl}
            class="link link-primary"
            target="_blank"
            rel="noopener noreferrer"
        >
            {recipe.originalUrl}
        </a>
    </div>
{/snippet}

<script lang="ts">
    const { data } = $props();
    const { recipe } = data;

    import Ingredients from '$lib/components/recipe/Ingredients.svelte';
    import {
        CalendarClockIcon,
        CalendarPlusIcon,
        ClockIcon,
        CookingPotIcon,
        ExternalLinkIcon,
        PencilIcon,
        ScrollTextIcon,
        TimerIcon,
        UsersIcon,
        UtensilsCrossedIcon,
        ChevronDown,
        ChevronUp
    } from 'lucide-svelte';

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
            <h1 class="text-4xl font-bold">{recipe.title}</h1>
            <button class="btn btn-ghost" onclick={() => (edit = !edit)}>
                <PencilIcon class="mr-2 h-5 w-5" />

                {edit ? 'Save Recipe' : 'Edit Recipe'}
            </button>
        </div>

        <div class="block gap-2 sm:grid sm:grid-cols-3">
            <div class="sm:col-span-2">
                {#if recipe.description}
                    {@render description()}
                {/if}
                <!-- Recipe Meta Info -->
                <div class="mb-6 flex gap-2">
                    {#if recipe.servings}
                        <div class="h-24 min-w-60">{@render metaInfoServings()}</div>
                    {/if}
                    {#if recipe.totalTime}
                        <div class="h-24 min-w-60">{@render metaInfoPrepTime()}</div>
                    {/if}
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
                <Ingredients ingredients={targetRecipe.ingredients} {deleteIngredient} {edit} />
            </div>
        </div>

        <!-- Steps Column -->
        <div class="lg:col-span-2">
            <h2 class="mb-4 flex items-center gap-2 text-2xl font-semibold">
                <ScrollTextIcon class="h-6 w-6" />
                Instructions
            </h2>
            <div class="space-y-6">
                {#each recipe.steps as step, index}
                    {#if step.heading}
                        <h3 class="mt-8 text-xl font-semibold first:mt-0">{step.description}</h3>
                    {:else}
                        <div class="collapse collapse-arrow bg-base-200 hover:bg-base-300">
                            <input type="checkbox" checked={true} />
                            <div class="collapse-title">
                                <h4 class="card-title">Step {index + 1}</h4>
                            </div>
                            <div class="collapse-content">
                                <p>{step.description}</p>
                                {#if step.linkedIngredients && step.linkedIngredients.length > 0}
                                    <div class="mt-4">
                                        <h5 class="mb-2 text-sm font-semibold">
                                            Ingredients for this step:
                                        </h5>
                                        <ul class="list-inside list-disc space-y-1">
                                            {#each step.linkedIngredients as linkedIng}
                                                <li>
                                                    {recipe.ingredients.find(
                                                        (ing) => ing.id === linkedIng.ingredientId
                                                    )?.notes}
                                                </li>
                                            {/each}
                                        </ul>
                                    </div>
                                {/if}
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
    </div>
{/snippet}

{#snippet metaInfoServings()}
    <div class="stat h-full rounded-lg bg-base-200 p-4">
        <div class="stat-title flex items-center gap-2">
            <UsersIcon class="h-4 w-4" />
            Servings
        </div>
        <div class="stat-value text-2xl">{recipe.servings}</div>
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

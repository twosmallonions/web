<script lang="ts">
    const { data } = $props();
    const { recipeSlug, recipe } = data;

    import {
        CalendarClockIcon,
        CalendarPlusIcon,
        ClockIcon,
        CookingPotIcon,
        ExternalLinkIcon,
        ListIcon,
        PencilIcon,
        ScrollTextIcon,
        TimerIcon,
        UserIcon,
        UsersIcon,
        UtensilsCrossedIcon,
        ChevronDown,
        ChevronUp
    } from 'lucide-svelte';
    import { quintOut } from 'svelte/easing';
    import { slide } from 'svelte/transition';

    let isRecipeDescriptionExpanded = $state(false);
    let maxDescriptionLength = 300;
    let truncatedDescription = $derived(
        recipe.description.length > maxDescriptionLength && !isRecipeDescriptionExpanded
            ? recipe.description.slice(0, maxDescriptionLength) + '…'
            : recipe.description
    );
</script>

<div class="container mx-auto max-w-4xl px-4 py-8">
    <!-- Recipe Header -->
    <header class="mb-12">
        <div class="mb-6 flex items-start justify-between">
            <h1 class="text-4xl font-bold">{recipe.title}</h1>
            <a href="/{recipeSlug}/edit" class="btn btn-ghost">
                <PencilIcon class="mr-2 h-5 w-5" />
                Edit Recipe
            </a>
        </div>

        {#if recipe.coverImage && recipe.coverImage.length > 0}
            <div class="mx-auto mb-8 max-w-2xl">
                <div class="overflow-hidden rounded-lg">
                    <picture>
                        {#each recipe.coverImage as url}
                            {@const extension = url.split('.').pop().split('?')[0].toLowerCase()}
                            {#if extension === 'avif'}
                                <source srcset={url} type="image/avif" />
                            {:else if extension === 'webp'}
                                <source srcset={url} type="image/webp" />
                            {:else}
                                <img
                                    src={url}
                                    alt={recipe.title}
                                    class="h-full w-full object-cover"
                                    loading="eager"
                                />
                            {/if}
                        {/each}
                    </picture>
                </div>
            </div>
        {/if}

        {#if recipe.description}
            <div class="prose mb-8 max-w-none">
                {#if isRecipeDescriptionExpanded}
                    <p transition:slide={{ duration: 300, easing: quintOut }}>
                        {truncatedDescription}
                    </p>
                {:else}
                    <p>{truncatedDescription}</p>
                {/if}
                {#if recipe.description.length > maxDescriptionLength}
                    <button
                        class="mt-2 flex items-center gap-1 text-sm text-base-400 hover:text-base-content"
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
        {/if}

        <!-- Recipe Meta Info -->
        <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {#if recipe.servings}
                <div class="stat rounded-lg bg-base-200 p-4">
                    <div class="stat-title flex items-center gap-2">
                        <UsersIcon class="h-4 w-4" />
                        Servings
                    </div>
                    <div class="stat-value text-2xl">{recipe.servings}</div>
                </div>
            {/if}

            {#if recipe.totalTime}
                <div class="stat rounded-lg bg-base-200 p-4">
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
            {/if}
        </div>

        {#if false}
            <div class="alert alert-info mb-6">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    /></svg
                >
                <span>{recipe.note}</span>
            </div>
        {/if}

        {#if recipe.originalUrl}
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
        {/if}
    </header>

    <!-- Main Content -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- Ingredients Column -->
        <div class="lg:col-span-1">
            <div class="sticky top-4">
                <h2 class="mb-4 flex items-center gap-2 text-2xl font-semibold">
                    <ListIcon class="h-6 w-6" />
                    Ingredients
                </h2>
                <div class="space-y-6">
                    {#each recipe.ingredients as ingredient, index}
                        {#if ingredient.heading}
                            <h3 class="mt-8 text-xl font-semibold first:mt-0">
                                {ingredient.notes}
                            </h3>
                        {:else}
                            <div class="pl-4 flex gap-2 text-left">
                                <input type="checkbox" class="checkbox checkbox-primary bg-transparent" id={`ingredientCheckbox${index}`}>
                                <label for={`ingredientCheckbox${index}`}>{ingredient.notes}</label>
                            </div>
                        {/if}
                    {/each}
                </div>
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
                        <div class="card bg-base-200">
                            <div class="card-body">
                                <h4 class="card-title">Step {index + 1}</h4>
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

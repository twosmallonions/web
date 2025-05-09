<script lang="ts">
    import { goto, invalidate } from '$app/navigation';
    import RecipeCard from '$lib/components/RecipeCard.svelte';
    import type { RecipeLight } from '$lib/types/recipe.js';
    import { ArrowDown, ArrowDownWideNarrow, ArrowUp, Search } from '@lucide/svelte';
    import { json } from '@sveltejs/kit';

    let { data } = $props();
    let { recipeProps, accessToken } = data;
    let recipes = $derived(recipeProps)
    const SortFields = {
        title: 'Alphabetical',
        updated_at: 'Last Modified',
        created_at: 'Last Added'
    } as const;

    type SortFieldKey = keyof typeof SortFields;

    enum SortOrder {
        ASC = 1,
        DESC
    }

    async function setSortField(key: SortFieldKey) {
        sortField = key;

        if (detailsSortFieldElement) {
            detailsSortFieldElement.removeAttribute('open');
        }
        await goto(`?field=${key}`, { replaceState: false, keepFocus: true, noScroll: true });
    }

    function changeSortOrder() {
        if (sortOrder === SortOrder.ASC) {
            sortOrder = SortOrder.DESC;
        } else {
            sortOrder = SortOrder.ASC;
        }
    }

    let detailsSortFieldElement: HTMLDetailsElement | undefined = $state();
    let sortField: SortFieldKey = $state('title');
    let sortOrder = $state(SortOrder.ASC);
</script>

<div class="flex h-full w-full flex-col gap-4">
    <div class="flex w-full flex-col gap-2 self-center lg:w-[80%]">
        <label class="floating-label input input-xl input-secondary w-full self-center">
            <Search />
            <input type="text" placeholder="Search For a Recipe" />
            <span>Search For a Recipe</span>
        </label>
        <div class="flex flex-row justify-end">
            <label class="swap swap-rotate btn btn-circle">
                <input type="checkbox" />
                <ArrowUp class="swap-on" />
                <ArrowDown class="swap-off" />
            </label>
            <details class="dropdown" bind:this={detailsSortFieldElement}>
                <summary class="btn p-5"><ArrowDownWideNarrow /> {SortFields[sortField]}</summary>
                <ul class="menu dropdown-content bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm">
                    {#each Object.entries(SortFields) as [key, value]}
                        <li>
                            <button onclick={() => setSortField(key as SortFieldKey)}
                                >{value}</button
                            >
                        </li>
                    {/each}
                </ul>
            </details>
        </div>
    </div>
    <div class="flex h-full flex-col items-center justify-between lg:items-start">
        <div class="w-full">
            {#if recipes.length > 0}
                <section class="mb-16">
                    <div class="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-5">
                        {#key recipes}
                            {#each recipes as recipe (recipe.id)}
                                <RecipeCard {recipe} {accessToken} />
                            {/each}
                        {/key}
                    </div>
                </section>
            {:else}
                <p class="text-base-content/70 italic">
                    It looks like you don't have any recipes yet...
                </p>
            {/if}
        </div>
        <div class="join self-center">
            <button class="join-item btn btn-active">1</button>
            <button class="join-item btn">2</button>
            <button class="join-item btn">3</button>
            <button class="join-item btn">4</button>
        </div>
    </div>
</div>

<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import RecipeCard from '$lib/components/RecipeCard.svelte';
    import {
        ArrowDownNarrowWide,
        ArrowDownWideNarrow,
        ArrowUpWideNarrow,
        Search
    } from '@lucide/svelte';

    let { data } = $props();
    let asdasd = data.recipeProps
    let recipes = $state(asdasd)
    let cursor = $derived(data.cursor)
    const SortFields = {
        title: 'Alphabetical',
        updated_at: 'Last Modified',
        created_at: 'Last Added'
    } as const;

    type SortFieldKey = keyof typeof SortFields;

    async function setSortField(key: SortFieldKey) {
        sortField = key;

        if (detailsSortFieldElement) {
            detailsSortFieldElement.removeAttribute('open');
        }
        let params = page.url.searchParams;
        params.set('field', key);
        params.delete('cursor');
        await goto(`?${params.toString()}`, { invalidateAll: true });

        recipes = data.recipeProps;
    }

    async function changeSortOrder() {
        let params = page.url.searchParams;
        console.log(sortDesc);
        if (sortDesc) {
            params.set('order', 'desc');
        } else {
            params.set('order', 'asc');
        }
        params.delete('cursor');
        await goto(`?${params.toString()}`, { invalidateAll: true });

        recipes = data.recipeProps;
    }

    async function nextPage() {
        let params = page.url.searchParams;
        params.set('cursor', cursor);
        await goto(`?${params.toString()}`, { invalidateAll: true });
        console.log(data.recipeProps)
        
        recipes.push(...data.recipeProps)
    }

    let detailsSortFieldElement: HTMLDetailsElement | undefined = $state();
    let sortField: SortFieldKey = $state(
        (page.url.searchParams.get('field') as SortFieldKey) ?? 'created_at'
    );
    let sortDesc = $state((page.url.searchParams.get('order') ?? 'desc') === 'desc');
</script>

<div class="flex h-full w-full flex-col gap-4">
    <div class="flex w-full flex-col gap-2 self-center lg:w-[80%]">
        <label class="floating-label input input-xl input-secondary w-full self-center">
            <Search />
            <input type="text" placeholder="Search For a Recipe" />
            <span>Search For a Recipe</span>
        </label>
        {sortDesc}
        <div class="flex flex-row justify-end">
            <label class="swap swap-rotate btn btn-circle">
                <input type="checkbox" onchange={changeSortOrder} bind:checked={sortDesc} />
                <ArrowDownNarrowWide class="swap-on" />
                <ArrowUpWideNarrow class="swap-off" />
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
                                <RecipeCard {recipe} />
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
            {#if cursor}
                <button class="join-item btn" onclick={nextPage}>Load More</button>
            {/if}
        </div>
    </div>
</div>

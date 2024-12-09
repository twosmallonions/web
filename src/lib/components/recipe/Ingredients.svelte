<script lang="ts">
    import type { Ingredient } from '$lib/types/recipe';
    import { GripVertical, ListIcon, Trash2, Plus } from 'lucide-svelte';
    import Sortable from 'sortablejs';
    import { onMount } from 'svelte';
    let {
        ingredients,
        edit = false,
        deleteIngredient,
        addIngredient,
        sortIngredients,
        dragAnimationDuration = 150
    }: {
        ingredients: Ingredient[];
        edit?: boolean;
        deleteIngredient: (index: number) => void;
        addIngredient: () => void;
        sortIngredients: (ids: string[]) => void;
        dragAnimationDuration?: number;
    } = $props();

    let ingredientElement: HTMLElement;

    onMount(async () => {
        let ingredientsSortable = Sortable.create(ingredientElement, {
            animation: dragAnimationDuration,
            group: 'ingredients',
            handle: '#ingredient-handle',
            dataIdAttr: 'data-id',
            onSort() {
                sortIngredients(ingredientsSortable.toArray());
            }
        });
    });
</script>

<h2 class="mb-4 flex place-content-between items-center gap-2">
    <div class="flex items-center gap-2 text-2xl font-semibold">
        <ListIcon class="h-6 w-6" />
        Ingredients
    </div>
    {#if edit}
        <button class="hover:text-gray-500" onclick={addIngredient}>
            <Plus />
        </button>
    {/if}
</h2>
<div bind:this={ingredientElement}>
    {#each ingredients as ingredient, index (ingredient.id)}
        {#if ingredient.heading}
            <h3 class="mt-8 text-xl font-semibold first:mt-0">
                {ingredient.notes}
            </h3>
        {:else}
            <div
                data-id={ingredient.id}
                class={`z-10 flex cursor-pointer gap-2 rounded-2xl p-3 pl-4 text-left ${edit ? '' : 'hover:bg-base-300'}`}
            >
                {#if edit}
                    {@render ingredientEdit(index, ingredient)}
                {:else}
                    {@render ingredientItem(index, ingredient)}
                {/if}
            </div>
        {/if}
    {/each}
</div>

{#snippet ingredientItem(index: number, ingredient: Ingredient)}
    <input type="checkbox" class="checkbox-primary checkbox" id={`ingredientCheckbox${index}`} />
    <label for={`ingredientCheckbox${index}`}>{ingredient.notes}</label>
{/snippet}

{#snippet ingredientEdit(index: number, ingredient: Ingredient)}
    <label class="input input-bordered flex w-full items-center gap-2">
        <button id="ingredient-handle">
            <GripVertical />
        </button>
        <input type="text" class="grow" bind:value={ingredient.notes} />
        <button class="text-red-500 hover:text-red-700" onclick={() => deleteIngredient(index)}>
            <Trash2 />
        </button>
    </label>
{/snippet}

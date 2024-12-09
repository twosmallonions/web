<script lang="ts">
    import type { Ingredient } from '$lib/types/recipe';
    import { GripVertical, ListIcon, Trash2 } from 'lucide-svelte';
    let {
        ingredients,
        edit = false,
        deleteIngredient
    }: {
        ingredients: Ingredient[];
        edit: boolean;
        deleteIngredient: (index: number) => void;
    } = $props();
</script>

<h2 class="mb-4 flex items-center gap-2 text-2xl font-semibold">
    <ListIcon class="h-6 w-6" />
    Ingredients
</h2>
<div>
    {#each ingredients as ingredient, index}
        {#if ingredient.heading}
            <h3 class="mt-8 text-xl font-semibold first:mt-0">
                {ingredient.notes}
            </h3>
        {:else}
            <div
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

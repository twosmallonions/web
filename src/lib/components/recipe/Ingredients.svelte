<script lang="ts">
    import type { Ingredient } from '$lib/types/recipe';
    import { GripVertical, ListIcon, Trash2 } from 'lucide-svelte';
    import DraggableList from './DraggableList.svelte';
    import RecipeListHeading from './RecipeListHeading.svelte';
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
</script>

{#snippet heading()}
    <RecipeListHeading TitleIcon={ListIcon} {edit} title="Ingredients" addItem={addIngredient} />
{/snippet}

{#snippet ingredientListEntry(ingredient: Ingredient, index: number, edit: boolean)}
    <li
        data-id={ingredient.id}
        class={`z-10 flex cursor-pointer gap-2 rounded-2xl p-3 pl-4 text-left ${edit ? '' : 'hover:bg-base-300'}`}
    >
        {@render (edit ? ingredientEdit : ingredientItem)(index, ingredient)}
    </li>
{/snippet}

{#snippet ingredientItem(index: number, ingredient: Ingredient)}
    <input type="checkbox" class="checkbox-primary checkbox" id={`ingredientCheckbox${index}`} />
    <label for={`ingredientCheckbox${index}`}>{ingredient.text}</label>
{/snippet}

{#snippet ingredientEdit(index: number, ingredient: Ingredient)}
    <label class="input input-bordered flex w-full items-center gap-2">
        <button id="item-handle">
            <GripVertical />
        </button>
        <input type="text" class="grow" bind:value={ingredient.text} />
        <button class="text-red-500 hover:text-red-700" onclick={() => deleteIngredient(index)}>
            <Trash2 />
        </button>
    </label>
{/snippet}

<DraggableList
    {heading}
    items={ingredients}
    sortItems={sortIngredients}
    itemSnippet={ingredientListEntry}
    {edit}
    {dragAnimationDuration}
/>

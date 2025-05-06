<script lang="ts">
    import {
        CirclePause,
        CookingPot,
        HandPlatter,
        Hourglass,
        Icon,
        Pencil,
        PlusCircle,
        Trash,
        Upload
    } from '@lucide/svelte';
    import recipePlaceholder from '$lib/assets/recipePlaceholder.jpg';
    import {
        mapRecipeFullToRecipeUpdate,
        type Ingredient,
        type Instruction
    } from '$lib/types/recipe.js';
    import Instructions from '$lib/components/recipe/Instructions.svelte';
    import Ingredients from '$lib/components/recipe/Ingredients.svelte';
    import MetadataDisplay from '$lib/components/recipe/MetadataDisplay.svelte';
    import MetadataTimeDisplay from '$lib/components/recipe/MetadataTimeDisplay.svelte';
    import { formatDate } from '$lib/formatUtil.js';

    let { data } = $props();
    let { recipeProp, accessToken } = data;
    let recipe = $state(recipeProp);
    let recipeCoverImage: FileList | undefined = $state();
    let recipeCoverInputElement: HTMLInputElement | undefined = $state();
    let coverImageUrl = $state('');
    const uploadCover = async () => {
        if (recipeCoverImage === undefined) {
            return;
        }

        if (recipeCoverImage.length == 0) {
            return;
        }
        const formData = new FormData();
        formData.append('file', recipeCoverImage[0]);
        await fetch(`/api/recipe/${recipe.collection}/${recipe.id}/cover`, {
            method: 'PUT',
            body: formData,
            headers: { authorization: `Bearer ${data.accessToken}` }
        });
    };

    let isTruncated = $derived.by(() => {
        return recipe.note.length > 700;
    });

    let displayTestNote = $derived.by(() => {
        if (recipe.note.length > 700) {
            return recipe.note.slice(0, 700) + '...';
        }
        return recipe.note;
    });

    let isExpanded = $state(false);
    let noteExpandButtonText = $state('Show More');
    const toggleExpandNote = () => {
        isExpanded = !isExpanded;
        noteExpandButtonText = isExpanded ? 'Show Less' : 'Show More';
    };


    let editMode = $state(false);
    let updatedRecipe = $state(mapRecipeFullToRecipeUpdate(recipeProp));
    let updateError: string | undefined = $state();
    const updateRecipe = async () => {
        const res = await fetch(`/collection/${recipe.collection}/recipe/${recipe.id}/update`, {
            body: JSON.stringify(updatedRecipe),
            headers: { 'content-type': 'application/json' },
            method: 'PUT',
            credentials: 'include'
        });
        if (!res.ok) {
            console.error(await res.text())
        }
        recipe = await res.json();
        updatedRecipe = mapRecipeFullToRecipeUpdate(recipe);
        editMode = false;
    };

    const deleteIngredient = (index: number) => {
        updatedRecipe.ingredients = [
            ...updatedRecipe.ingredients.slice(0, index),
            ...updatedRecipe.ingredients.slice(index + 1)
        ];
    };

    const addIngredient = () => {
        updatedRecipe.ingredients.push({
            text: '',
            id: null
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
            id: null,
            text: ''
        });
    };

    const sortInstruction = (ids: string[]) => {
        const ingredientMap = new Map(
            updatedRecipe.instructions!.map((instruction) => [instruction.id, instruction])
        );
        updatedRecipe.instructions = ids
            .map((id) => ingredientMap.get(id))
            .filter((instruction): instruction is Instruction => instruction !== undefined);
    };
</script>

<div>
    <div class="grid max-w-[90rem] grid-cols-1 gap-4 lg:grid-cols-16">
        <div class="relative aspect-square w-full place-self-center lg:col-span-6 lg:max-h-[800px]">
            {@render image()}
        </div>
        <div class="lg:col-span-10">{@render metadata()}</div>
        <div class="lg:col-span-5">{@render ingredients()}</div>
        <div class="lg:col-span-11">{@render instructions()}</div>
    </div>
    <div class="divider"></div>
    <div class="text-base-content/70 flex flex-row gap-5 text-sm">
        {@render metadataDateDisplay(PlusCircle, 'Created At', recipe.createdAt)}
        {@render metadataDateDisplay(Pencil, 'Updated At', recipe.updatedAt)}
    </div>
</div>

{#snippet instructions()}
    <Instructions
        instructions={recipe.instructions ?? []}
        {addInstruction}
        {deleteInstruction}
        {sortInstruction}
        edit={editMode}
    />
{/snippet}

{#snippet ingredients()}
    <Ingredients
        ingredients={recipe.ingredients ?? []}
        {addIngredient}
        {deleteIngredient}
        {sortIngredients}
        edit={editMode}
    />
{/snippet}

{#snippet image()}
    {#if recipe.coverImage}
        <img
            src={`/collection/${recipe.collection}/asset/${recipe.coverImage}`}
            alt=""
            class="rounded-md"
        />
    {:else}
        <img src={recipePlaceholder} alt="" class="rounded-md" />
    {/if}

    {#if editMode}
        <div class="absolute right-1 bottom-1 flex flex-row gap-2">
            <button
                class="btn btn-circle btn-accent"
                aria-label="Upload Recipe Image"
                onclick={() => recipeCoverInputElement?.click()}
            >
                <Upload />
            </button>
            <input
                type="file"
                class="hidden"
                bind:files={recipeCoverImage}
                bind:this={recipeCoverInputElement}
                accept="image/*"
            />
            {#if recipe.coverImage}
                <button class="btn btn-circle btn-error" aria-label="Delete Recipe Image">
                    <Trash />
                </button>
            {/if}
        </div>
    {/if}
{/snippet}

{#snippet metadata()}
    <div class="flex h-full flex-col gap-y-5">
        <div class="grow">
            <div>{@render recipeTitle()}</div>
            <div class="divider"></div>
            <div class="grid grid-cols-2 gap-3">
                <MetadataTimeDisplay
                    MetadataIcon={CirclePause}
                    description="Prep Time"
                    minutes={recipe.prepTime}
                    {editMode}
                    bind:bindValue={updatedRecipe.prepTime}
                />
                <MetadataTimeDisplay
                    MetadataIcon={CookingPot}
                    description="Cook Time"
                    minutes={recipe.cookTime}
                    {editMode}
                    bind:bindValue={updatedRecipe.cookTime}
                />
                <MetadataTimeDisplay
                    MetadataIcon={Hourglass}
                    description="Total Time"
                    minutes={recipe.totalTime}
                    {editMode}
                    editable={false}
                    bind:bindValue={recipe.totalTime}
                />
                <MetadataDisplay
                    MetadataIcon={HandPlatter}
                    description="Yield"
                    content={recipe.recipeYield}
                    {editMode}
                    bind:bindValue={updatedRecipe.recipeYield}
                    inputType="text"
                />
            </div>
            <div class="divider"></div>
            {@render note()}
        </div>
        <div class="flex justify-between">
            {#if recipe.originalUrl}
                <a
                    class="btn btn-soft btn-accent"
                    href={recipe.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer">Open Original Recipe</a
                >
            {/if}
            <button
                class="btn btn-soft btn-primary"
                onclick={() => (editMode ? updateRecipe() : (editMode = true))}
                >{editMode ? 'Save Recipe' : 'Edit Recipe'}</button
            >
        </div>
    </div>
{/snippet}

{#snippet recipeTitle()}
    {#if editMode}
        <label class="floating-label">
            <input type="text" class="input input-xl w-full" bind:value={updatedRecipe.title} />
            <span>Recipe Title</span>
        </label>
    {:else}
        <h2 class="text-2xl wrap-break-word lg:text-4xl">
            {recipe.title}
        </h2>
    {/if}
{/snippet}

{#snippet note()}
    {#if editMode}
        <textarea bind:value={updatedRecipe.note} rows="6" class="textarea w-full"></textarea>
    {:else}
        {#if isExpanded}
            <p class="text-md my-3">{recipe.note}</p>
        {:else}
            <p class="text-md my-3">{displayTestNote}</p>
        {/if}

        {#if isTruncated}
            <button class="btn btn-accent btn-outline btn-sm" onclick={toggleExpandNote}
                >{noteExpandButtonText}</button
            >
        {/if}
    {/if}
{/snippet}

{#snippet metadataDateDisplay(MetadataIcon: typeof Icon, description: string, instantStr: string)}
    <div class="flex flex-row items-center gap-2">
        <MetadataIcon size="18" />
        <span>{description}: {formatDate(instantStr)}</span>
    </div>
{/snippet}

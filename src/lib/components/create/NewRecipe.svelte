<script lang="ts">
    import { ApiErrorDescription } from "$lib/services/apiError";
    import type { CollectionFull } from "$lib/types/collections";
    import { error } from "@sveltejs/kit";
    import {createRecipe as serviceCreateRecipe} from '$lib/services/recipeService'
    import { goto } from "$app/navigation";
    import CollectionSubmitRow from "./CollectionSubmitRow.svelte";
    

    interface Props {
        collections: CollectionFull[]
        accessToken: string;
    }

    let { collections, accessToken }: Props = $props();

    let loading = $state(false);
    let newRecipeTitle = $state('');
    let newRecipeError: String | undefined = $state();
    let newRecipeForm: HTMLFormElement;
    const createRecipe = async (newRecipeCollectionId: string) => {
        if(!newRecipeForm.checkValidity()) {
            return;
        }
        if (loading) {
            return;
        }

        loading = true;
        const newRecipe = await serviceCreateRecipe(newRecipeCollectionId, {title: newRecipeTitle}, {accessToken, fetch});
        if (newRecipe instanceof ApiErrorDescription) {
            newRecipeError = newRecipe.humanDescription;
            console.error(newRecipeError);
            return;
        }

        goto(`/collection/${newRecipe.collection}/recipe/${newRecipe.id}`);
    };
</script>

<!-- Manual Creation Section -->
<div class="rounded-box bg-base-200 p-6 shadow-lg">
    <h2 class="mb-4 text-xl font-semibold">Start from Scratch</h2>
    <p class="text-base-content/70 mb-4">
        Create your own recipe with our easy-to-use recipe editor.
    </p>

    <form bind:this={newRecipeForm}>
        <div class="space-y-4">
            <div class="fieldset">
                <input
                    type="text"
                    placeholder="Give your recipe a name"
                    class="input input-bordered validator w-full"
                    bind:value={newRecipeTitle}
                    required
                />
                <p class="label">Recipe Title</p>
            </div>
            <CollectionSubmitRow {collections} {loading} createFn={createRecipe}/>
            {#if newRecipeError}
                <div>
                    <span class="text-error">{newRecipeError}</span>
                </div>
            {/if}
        </div>
    </form>
</div>

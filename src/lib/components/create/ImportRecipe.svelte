<script lang="ts">
    import { goto } from "$app/navigation";
    import { ApiErrorDescription, ApiValidationError } from "$lib/services/apiError";
    import { importRecipe } from "$lib/services/recipeService";
    import type { CollectionFull } from "$lib/types/collections";
    import CollectionSubmitRow from "./CollectionSubmitRow.svelte";

    interface Props {
        collections: CollectionFull[]
        accessToken: string;
    }

    let { collections, accessToken }: Props = $props();
    let loading = $state(false);
    let newRecipeUrl = $state('')
    let newRecipeError: String | undefined = $state();
    const createRecipe = async (newRecipeCollectionId: string) => {
        if (loading) {
            return;
        }

        loading = true;

        const newRecipe = await importRecipe({url: newRecipeUrl}, newRecipeCollectionId, {accessToken, fetch})

        if (newRecipe instanceof ApiErrorDescription) {
            newRecipeError = newRecipe.humanDescription;
            if (newRecipe instanceof ApiValidationError) {
                console.log(newRecipe)
            }
            loading = false;
            return;
        }

        goto(`/collection/${newRecipe.collection}/recipe/${newRecipe.id}`);
    }
</script>
<div class="rounded-box bg-base-200 p-6 shadow-lg">
    <h2 class="mb-4 text-xl font-semibold">Import from the Web</h2>
    <p class="text-base-content/70 mb-4">Import a recipe from a URL.</p>

    <!-- URL Input -->
    <div class="space-y-4">
        <label class="floating-label">

        <input type="url" placeholder="Recipe URL" class="input input-bordered w-full" bind:value={newRecipeUrl} />
        <span>Recipe URL</span>
        </label>

        <CollectionSubmitRow {collections} {loading} createFn={createRecipe}/>
    </div>

    {#if newRecipeError}
        <div>
            <span class="text-error">{newRecipeError}</span>
        </div>
    {/if}
</div>

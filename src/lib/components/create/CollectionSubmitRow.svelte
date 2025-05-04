<script lang="ts">
    import type { CollectionFull } from "$lib/types/collections";
    import { error } from "@sveltejs/kit";

    interface Props {
        collections: CollectionFull[];
        loading: boolean;
        createFn(collectionId: string): void;
    }

    let { collections, loading, createFn }: Props = $props();

    let defaultCollection = collections.find((col) => col.name === 'Default');
    if (!defaultCollection) {
        error(500, 'no default collection');
    }
    let newRecipeCollectionId: string = $state(defaultCollection.id);
</script>
<div class="flex items-center justify-between">
    <div class="fieldset">
        <select class="select w-44" bind:value={newRecipeCollectionId} required>
            {#each collections as collection (collection.id)}
                <option value={collection.id}>{collection.name}</option>
            {/each}
        </select>
        <p class="label">Collection</p>
    </div>
    <button class="btn btn-primary" disabled={loading} type="submit" onclick={() => createFn(newRecipeCollectionId)}>
        {#if !loading}
            Create Recipe
        {:else}
            <span class="loading loading-spinner loading-md"></span>
        {/if}
    </button>
</div>

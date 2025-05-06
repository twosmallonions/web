<script lang="ts">
    import { enhance } from '$app/forms';
    import type { CollectionFull } from '$lib/types/collections';
    import CollectionSubmitRow from './CollectionSubmitRow.svelte';

    interface Props {
        collections: CollectionFull[];
        error?: string
    }

    let { collections, error }: Props = $props();
    let loading = $state(false);
</script>

<div class="rounded-box bg-base-200 p-6 shadow-lg">
    <h2 class="mb-4 text-xl font-semibold">Import from the Web</h2>
    <p class="text-base-content/70 mb-4">Import a recipe from a URL.</p>

    <!-- URL Input -->
    <form
        class="space-y-4"
        method="POST"
        action="?/import"
        use:enhance={() => {
            loading = true;

            return async ({ update }) => {
                loading = false;
                update();
            };
        }}
    >
        <label class="floating-label">
            <input
                type="url"
                placeholder="Recipe URL"
                class="input input-bordered w-full validator"
                name="recipeUrl"
                required
            />
            <span>Recipe URL</span>
        </label>

        <CollectionSubmitRow {collections} {loading} />
    </form>

    {#if error}
        <div>
            <span class="text-error">{error}</span>
        </div>
    {/if}
</div>

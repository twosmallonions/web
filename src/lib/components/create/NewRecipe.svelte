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

<!-- Manual Creation Section -->
<div class="rounded-box bg-base-200 p-6 shadow-lg">
    <h2 class="mb-4 text-xl font-semibold">Start from Scratch</h2>
    <p class="text-base-content/70 mb-4">
        Create your own recipe with our easy-to-use recipe editor.
    </p>

    <form
        class="space-y-4"
        method="POST"
        action="?/create"
        use:enhance={() => {
            loading = true;

            return async ({ update }) => {
                loading = false;
                update();
            };
        }}
    >
        <div class="fieldset">
            <input
                type="text"
                placeholder="Give your recipe a name"
                class="input input-bordered validator w-full"
                required
                name="recipeTitle"
            />
            <p class="label">Recipe Title</p>
        </div>
        <CollectionSubmitRow {collections} {loading} />
        {#if error}
            <div>
                <span class="text-error">{error}</span>
            </div>
        {/if}
    </form>
</div>

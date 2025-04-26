<script lang="ts">
    import { goto } from '$app/navigation';
    import client from '$lib';
    let { data } = $props();

    let loading = $state(false);
    let newRecipeTitle = $state('');
    let newRecipeCollectionId: string = $state();

    const createRecipe = async () => {
        if (loading) {
            return;
        }

        loading = true;
        const newRecipe = await client.POST('/api/recipe/{collection_id}', {
            params: {
                path: {collection_id: newRecipeCollectionId},
                header: {authorization: `Bearer ${data.session?.accessToken}`}
            },
            body: {
                title: newRecipeTitle
            }
        });

        if (!newRecipe.data) {
            console.error(newRecipe.error);
            return
        }

        goto(`/collection/${newRecipe.data?.collection}/recipe/${newRecipe.data?.id}`);
    };
</script>

<div class="min-h-screen p-4 md:p-8">
  {JSON.stringify(data.collections)}
    <!-- Header Section -->
    <div class="mb-12 text-center">
        <h1 class="mb-2 text-2xl font-bold md:text-3xl">Add New Recipe</h1>
        <p class="text-base-content/70">Choose how you'd like to create your recipe</p>
    </div>

    <div class="mx-auto max-w-2xl space-y-8">
        <!-- Import Section -->
        <div class="rounded-box bg-base-200 p-6 shadow-lg">
            <h2 class="mb-4 text-xl font-semibold">Import from the Web</h2>
            <p class="mb-4 text-base-content/70">
                Found a great recipe online? Just paste the link and we'll import all the details
                for you.
            </p>

            <!-- URL Input -->
            <div class="space-y-4">
                <div class="form-control">
                    <input
                        type="url"
                        placeholder="https://..."
                        class="input input-bordered w-full"
                    />
                </div>

                <!-- Advanced Options -->
                <div class="collapse collapse-arrow rounded-lg bg-base-300">
                    <input type="checkbox" />
                    <div class="collapse-title text-sm font-medium">Advanced Options</div>
                    <div class="collapse-content">
                        <div class="space-y-2 pt-2">
                            <label class="flex cursor-pointer items-center gap-2">
                                <input type="checkbox" class="checkbox checkbox-sm" />
                                <span class="text-sm">Import categories as tags</span>
                            </label>
                            <label class="flex cursor-pointer items-center gap-2">
                                <input type="checkbox" class="checkbox checkbox-sm" />
                                <span class="text-sm">Review before saving</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <a href="/" class="link link-primary text-sm"
                        >Need to import multiple recipes?</a
                    >
                    <button class="btn btn-primary">Import Recipe</button>
                </div>
            </div>
        </div>

        <!-- Divider -->
        <div class="divider text-base-content/50">OR</div>

        <!-- Manual Creation Section -->
        <div class="rounded-box bg-base-200 p-6 shadow-lg">
            <h2 class="mb-4 text-xl font-semibold">Start from Scratch</h2>
            <p class="mb-4 text-base-content/70">
                Create your own recipe with our easy-to-use recipe editor.
            </p>

            <div class="space-y-4">
                <div class="form-control">
                    <input
                        type="text"
                        placeholder="Give your recipe a name"
                        class="input input-bordered w-full"
                        bind:value={newRecipeTitle}
                    />
                </div>

                <div class="flex justify-between">
                        <select class="select" bind:value={newRecipeCollectionId}>
                            {#each data.collections as collection (collection.id)}
                                <option value={collection.id}>{collection.name}</option>
                            {/each}
                        </select>
                        <button class="btn btn-primary" onclick={createRecipe}>
                            {#if !loading}
                                Create Recipe
                            {:else}
                                <span class="loading loading-spinner loading-md"></span>
                            {/if}
                        </button>
                </div>
            </div>
        </div>
    </div>
</div>

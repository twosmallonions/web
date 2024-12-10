<script lang="ts">
    import { Icon, Plus } from 'lucide-svelte';
    import type { ComponentType } from 'svelte';
    // TODO: Currently the new svelte 5 'Component' interface doesn't work with lucide-svelte
    // so ComponentType will have to be used until it's supported.
    // https://github.com/lucide-icons/lucide/issues/2565
    const {
        TitleIcon,
        AddIcon = Plus,
        edit,
        title,
        addItem
    }: {
        TitleIcon: ComponentType<Icon>;
        AddIcon?: ComponentType<Icon>;
        edit: boolean;
        title: string;
        addItem: () => void;
    } = $props();
</script>

<h2 class="mb-4 flex place-content-between items-center gap-2">
    <div class="flex items-center gap-2 text-2xl font-semibold">
        <TitleIcon class="h-6 w-6" />
        {title}
    </div>
    {#if edit}
        <button class="hover:text-gray-500" onclick={addItem}>
            <AddIcon />
        </button>
    {/if}
</h2>

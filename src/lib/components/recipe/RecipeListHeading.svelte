<script lang="ts">
    import { Icon as IconType, Plus } from '@lucide/svelte';
    const {
        TitleIcon,
        AddIcon = Plus,
        edit,
        title,
        addItem
    }: {
        TitleIcon: typeof IconType;
        AddIcon?: typeof IconType;
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

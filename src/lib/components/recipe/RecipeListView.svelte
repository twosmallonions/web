<script lang="ts">
    import type { Snippet } from "svelte";

    const {
        collection,
        deleteAction,
        sortAction,
        addAction,
        edit = false,
        title
    }: {
        collection: string[];
        deleteAction: (index: number) => void;
        edit?: boolean;
        addAction: () => void;
        sortAction: (ids: string[]) => void;
        title: Snippet;
    } = $props();
</script>

{@render title()}

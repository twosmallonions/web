<script lang="ts" generics="T extends { id: string }">
    import Sortable from 'sortablejs';
    import { onMount, type Snippet } from 'svelte';

    const {
        heading,
        dragAnimationDuration = 150,
        sortItems,
        items,
        itemSnippet,
        edit,
        itemContainerClass
    }: {
        heading: Snippet;
        dragAnimationDuration?: number;
        sortItems: (ids: string[]) => void;
        // eslint-disable-next-line no-undef
        items: T[];
        // eslint-disable-next-line no-undef
        itemSnippet: Snippet<[item: T, index: number, edit: boolean]>;
        edit: boolean;
        itemContainerClass?: string;
    } = $props();

    let listElement: HTMLElement;

    onMount(() => {
        let sortable = Sortable.create(listElement, {
            animation: dragAnimationDuration,
            group: 'sortable-items',
            handle: '#item-handle',
            dataIdAttr: 'data-id',
            onSort: () => sortItems(sortable.toArray())
        });
    });
</script>

{@render heading()}

<ol class={itemContainerClass} bind:this={listElement}>
    {#each items as item, index (item.id)}
        {@render itemSnippet(item, index, edit)}
    {/each}
</ol>

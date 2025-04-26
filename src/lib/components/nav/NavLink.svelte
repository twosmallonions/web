<script lang="ts">
    import {type Icon as IconType} from '@lucide/svelte';
    export let target: string;
    export let text: string;
    export let icon: typeof IconType;
</script>

<li>
    <a href={target} class="flex items-center gap-3 py-3">
        <svelte:component this={icon} class="h-4 w-4" />
        <span>{text}</span>
    </a>
</li>

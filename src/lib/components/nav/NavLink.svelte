<script lang="ts">
    export let target: string;
    export let text: string;
    export let icon;
</script>

<li>
    <a href={target} class="flex items-center gap-3 py-3">
        <svelte:component this={icon} class="h-4 w-4" />
        <span>{text}</span>
    </a>
</li>

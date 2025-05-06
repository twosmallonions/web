<script lang="ts">
    import {type Icon as IconType} from '@lucide/svelte';
    let {target, text, Icon}: {target: string, text: string, Icon: typeof IconType} = $props();
</script>

<li>
    <a href={target} class="flex items-center gap-3 py-3">
        <Icon class="h-4 w-4"/>
        <span>{text}</span>
    </a>
</li>

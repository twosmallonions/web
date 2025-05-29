<script lang="ts">
    import {type Icon as IconType} from '@lucide/svelte';
    let {target, text, Icon, isActive}: {target: string, text: string, Icon: typeof IconType, isActive: boolean} = $props();
</script>

<li>
    <a href={target} class="flex items-center gap-3 {isActive ? 'menu-active' : ''}">
        <Icon class="h-4 w-4"/>
        <span>{text}</span>
    </a>
</li>

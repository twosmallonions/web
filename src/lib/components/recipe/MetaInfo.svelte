<script lang="ts" generics="T">
    import { Icon } from 'lucide-svelte';
    import type { ComponentType } from 'svelte';

    let {
        title,
        value,
        description,
        StatIcon,
        edit,
        rawValue
    }: {
        // eslint-disable-next-line no-undef
        rawValue: T;
        edit: boolean;
        title: string;
        value: string;
        description?: string;
        StatIcon: ComponentType<Icon>;
    } = $props();
</script>

<div class="stats bg-base-200 shadow">
    <div class="stat">
        <div class="stat-figure"><StatIcon /></div>
        <div class="stat-title">{title}</div>
        {#if edit}
            <div class="stat-value">
                <input type="text" class="input input-bordered" bind:value={rawValue} />
            </div>
        {:else}
            <div class="stat-value">{value}</div>
        {/if}
        <div class="stat-desc">{description}</div>
    </div>
</div>

<script lang="ts">
    import type { Icon } from '@lucide/svelte';
    import MetadataDisplay from './MetadataDisplay.svelte';
    import { Temporal } from 'temporal-polyfill';

    interface Props {
        MetadataIcon: typeof Icon;
        editMode: boolean;
        description: string;
        minutes?: number | null;
        bindValue?: number | null
        editable?: boolean
    }

    let { MetadataIcon, editMode, description, minutes, bindValue = $bindable(), editable = true }: Props =
        $props();

    function formatDuration(minutes: number): string {
        return Temporal.Duration.from({minutes}).round({largestUnit: 'hours', smallestUnit: 'minutes'}).toLocaleString('en-us', {style: 'short'})
    }
</script>

<MetadataDisplay
    {MetadataIcon}
    {editMode}
    {description}
    content={formatDuration(minutes ?? 0)}
    bind:bindValue={bindValue}
    inputType={'number'}
    {editable}
    fieldLegend='in Minutes'
/>

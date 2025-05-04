<script lang="ts" generics="RawValue">
    import type { Icon } from '@lucide/svelte';
    import type { HTMLInputTypeAttribute } from 'svelte/elements';

    interface Props {
        MetadataIcon: typeof Icon;
        editMode: boolean;
        description: string;
        content?: string | null;
        inputType: HTMLInputTypeAttribute;
        bindValue?: RawValue;
        editable?: boolean;
        fieldLegend?: string
    }

    let {
        MetadataIcon,
        editMode,
        description,
        content,
        inputType,
        bindValue = $bindable(),
        editable = true,
        fieldLegend
    }: Props = $props();

    let visible = $derived(editMode || content);
</script>

<div class="{visible ? 'flex' : 'hidden'} flex-row items-center gap-2">
    {#if editMode}
        {@render edit()}
    {:else}
        {@render display()}
    {/if}
</div>

{#snippet display()}
    <MetadataIcon /> <span>{description} : {content}</span>
{/snippet}

{#snippet edit()}
    <MetadataIcon />

    <fieldset class="fieldset">
        <label class="floating-label">
            <input
                type={inputType}
                bind:value={bindValue}
                class="input"
                disabled={!editable}
            />
            <span>{description}</span>
        </label>
        {#if fieldLegend && editable}
            <p class="label">{fieldLegend}</p>
        {/if}
    </fieldset>
{/snippet}

<script lang="ts">
    import type { Instruction } from '$lib/types/recipe';
    import { GripVertical, ScrollTextIcon, Trash2 } from 'lucide-svelte';
    import RecipeListHeading from './RecipeListHeading.svelte';
    import DraggableList from './DraggableList.svelte';

    const {
        instructions,
        deleteInstruction,
        sortInstruction,
        addInstruction,
        edit = false,
        dragAnimationDuration = 150
    }: {
        instructions: Instruction[];
        deleteInstruction: (index: number) => void;
        edit?: boolean;
        addInstruction: () => void;
        sortInstruction: (ids: string[]) => void;
        dragAnimationDuration?: number;
    } = $props();
</script>

{#snippet heading()}
    <RecipeListHeading
        TitleIcon={ScrollTextIcon}
        {edit}
        title="Instructions"
        addItem={addInstruction}
    />
{/snippet}

{#snippet stepListEntry(step: Instruction, index: number, edit: boolean)}
    <li class="collapse collapse-arrow bg-base-200 hover:bg-base-300" data-id={step.id}>
        <input type="checkbox" checked={true} />
        {@render (edit ? editStep : normalStep)(step, index)}
    </li>
{/snippet}

{#snippet normalStep(step: Instruction, index: number)}
    <div class="collapse-title">
        <h4 class="card-title">Step {index + 1}</h4>
    </div>
    <div class="collapse-content">
        <p>{step.description}</p>
    </div>
{/snippet}

{#snippet editStep(step: Instruction, index: number)}
    <div class="collapse-title">
        <div class="flex place-content-between">
            <div class="z-50 flex gap-3">
                <button id="item-handle" class="z-50">
                    <GripVertical />
                </button>
                <h4 class="card-title">Step {index + 1}</h4>
            </div>
            <button
                class="z-50 text-red-500 hover:text-red-700"
                onclick={() => deleteInstruction(index)}><Trash2 /></button
            >
        </div>
    </div>
    <div class="collapse-content">
        <textarea class="textarea textarea-bordered w-full" rows="4" bind:value={step.description}
        ></textarea>
    </div>
{/snippet}

<DraggableList
    {heading}
    items={instructions}
    sortItems={sortInstruction}
    itemSnippet={stepListEntry}
    {edit}
    {dragAnimationDuration}
    itemContainerClass="space-y-6"
/>

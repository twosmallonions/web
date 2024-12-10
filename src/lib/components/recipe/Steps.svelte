<script lang="ts">
    import type { Step } from '$lib/types/recipe';
    import { GripVertical, ScrollTextIcon, Trash2 } from 'lucide-svelte';
    import RecipeListHeading from './RecipeListHeading.svelte';
    import DraggableList from './DraggableList.svelte';

    const {
        steps,
        deleteStep,
        sortSteps,
        addStep,
        edit = false,
        dragAnimationDuration = 150
    }: {
        steps: Step[];
        deleteStep: (index: number) => void;
        edit?: boolean;
        addStep: () => void;
        sortSteps: (ids: string[]) => void;
        dragAnimationDuration?: number;
    } = $props();
</script>

{#snippet heading()}
    <RecipeListHeading TitleIcon={ScrollTextIcon} {edit} title="Instructions" addItem={addStep} />
{/snippet}

{#snippet stepListEntry(step: Step, index: number, edit: boolean)}
    <li class="collapse collapse-arrow bg-base-200 hover:bg-base-300" data-id={step.id}>
        <input type="checkbox" checked={true} />
        {@render (edit ? editStep : normalStep)(step, index)}
    </li>
{/snippet}

{#snippet normalStep(step: Step, index: number)}
    <div class="collapse-title">
        <h4 class="card-title">Step {index + 1}</h4>
    </div>
    <div class="collapse-content">
        <p>{step.description}</p>
    </div>
{/snippet}

{#snippet editStep(step: Step, index: number)}
    <div class="collapse-title">
        <div class="flex place-content-between">
            <div class="z-50 flex gap-3">
                <button id="item-handle" class="z-50">
                    <GripVertical />
                </button>
                <h4 class="card-title">Step {index + 1}</h4>
            </div>
            <button class="z-50 text-red-500 hover:text-red-700" onclick={() => deleteStep(index)}
                ><Trash2 /></button
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
    items={steps}
    sortItems={sortSteps}
    itemSnippet={stepListEntry}
    {edit}
    {dragAnimationDuration}
    itemContainerClass="space-y-6"
/>

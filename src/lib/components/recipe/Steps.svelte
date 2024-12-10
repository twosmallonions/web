<script lang="ts">
    import type { Step } from '$lib/types/recipe';
    import { GripVertical, Plus, ScrollTextIcon, Trash2 } from 'lucide-svelte';
    import Sortable from 'sortablejs';
    import { onMount } from 'svelte';

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

    let stepElement: HTMLElement;

    onMount(async () => {
        let stepSortable = Sortable.create(stepElement, {
            animation: dragAnimationDuration,
            group: 'ingredients',
            handle: '#step-handle',
            dataIdAttr: 'data-id',
            onSort() {
                sortSteps(stepSortable.toArray());
            }
        });
    });
</script>

<h2 class="mb-4 flex place-content-between items-center gap-2">
    <div class="flex items-center gap-2 text-2xl font-semibold">
        <ScrollTextIcon class="h-6 w-6" />
        Instructions
    </div>
    {#if edit}
        <button class="hover:text-gray-500" onclick={addStep}>
            <Plus />
        </button>
    {/if}
</h2>
<div class="space-y-6" bind:this={stepElement}>
    {#each steps as step, index (step.id)}
        <div class="collapse collapse-arrow bg-base-200 hover:bg-base-300" data-id={step.id}>
            <input type="checkbox" checked={true} />
            {@render (edit ? editStep : normalStep)(step, index)}
        </div>
    {/each}
</div>

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
                <button id="step-handle" class="z-50">
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

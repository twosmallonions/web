<script lang="ts">
    import { CirclePause, CookingPot, HandPlatter, Hourglass, Icon, Pencil, PlusCircle } from '@lucide/svelte';
    import recipePlaceholder from '$lib/assets/recipePlaceholder.jpg';
    import { Temporal } from 'temporal-polyfill';

    let { data } = $props();
    let { recipe } = data;
    let files: FileList | undefined = $state();
    let coverImageUrl = $state('');
    const uploadCover = async () => {
        if (files === undefined) {
            return;
        }

        const filesArray = Array.from(files);
        if (filesArray.length == 0) {
            return;
        }
        const formData = new FormData();
        formData.append('file', filesArray[0]);
        await fetch(`/api/recipe/${recipe?.collection}/${recipe?.id}/cover`, {
            method: 'PUT',
            body: formData,
            headers: { authorization: `Bearer ${data.accessToken}` }
        });
    };

    // @ts-ignore: https://github.com/microsoft/TypeScript/pull/60646
    const durationFormat = new Intl.DurationFormat('en', { style: 'narrow' });

    const fetchRecipeCover = async () => {
        if (!recipe?.coverImage) {
            return;
        }

        const res = await fetch(recipe.coverImage, {
            headers: { authorization: `Bearer ${data.accessToken}` }
        });

        const coverBlob = await res.blob();
        coverImageUrl = URL.createObjectURL(coverBlob);
    };

    let testNote = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at tortor sit amet odio semper ullamcorper. Maecenas purus augue, feugiat in consectetur sed, imperdiet eget ipsum. Etiam non tellus nunc. Mauris id condimentum ex. Nunc nibh erat, sodales quis nulla ut, venenatis dignissim massa. Vivamus id euismod magna, commodo finibus est. Aenean interdum tempor purus, a ornare est malesuada et. Vestibulum euismod blandit risus, sit amet cursus velit varius vitae. Phasellus dapibus urna id sem porta, eget eleifend turpis rhoncus. Quisque lobortis quam nec magna interdum, in porta diam sagittis. Aenean dui felis, semper vel urna sit amet, pulvinar faucibus est. Sed in tellus sit amet metus rhoncus cursus. Sed eu porttitor risus. Donec finibus, turpis ut malesuada pharetra, sem quam consequat augue, nec semper quam odio eu tellus.
Curabitur in mi leo. Sed nec orci eget sapien pharetra semper sed eget tortor. Maecenas pellentesque tristique est, eget fermentum mi fringilla eget. Aliquam odio ante, condimentum nec venenatis et, tempor at nunc. Vivamus vestibulum ipsum maximus est pharetra pulvinar. Integer hendrerit, lacus at ultricies molestie, nisl mauris auctor felis, at elementum mauris orci id ex. Ut aliquet, eros eu porta vestibulum, massa eros efficitur arcu, ac mollis mi diam non tortor. Proin sodales ligula ligula, quis feugiat nunc tristique et.
Morbi facilisis ex vitae velit accumsan, ut semper sem blandit. Nullam quis ultrices purus. Ut non aliquam diam. Mauris erat sapien, pellentesque malesuada vestibulum sed, pellentesque ac metus. Morbi odio lectus, feugiat ut erat in, tincidunt auctor felis. Fusce a purus placerat, scelerisque libero quis, ullamcorper urna. Suspendisse a dolor tortor. Quisque feugiat efficitur sapien et ullamcorper. Maecenas ac velit sit amet est malesuada consectetur id quis nunc. Morbi ac pharetra tortor, eu gravida lacus.
Maecenas ut dapibus lorem. Donec finibus efficitur tempor. Maecenas scelerisque iaculis erat. Vivamus vitae commodo purus, vitae fringilla felis. Donec consequat dui placerat consectetur facilisis. Nulla molestie velit odio. In tincidunt pretium felis, eu fermentum augue ornare in. Duis non nulla diam.
Donec ornare accumsan quam non commodo. Aenean non justo sit amet risus auctor ullamcorper ut ut libero. Vivamus lobortis lacus elit, ut cursus ex consectetur ut. Praesent vulputate vehicula eros non sodales. Pellentesque porta quam nec risus dapibus facilisis. Mauris ac auctor enim. Suspendisse sollicitudin sagittis nunc, nec euismod diam suscipit id. Maecenas vehicula metus dui, eget sodales ex dictum ac. Donec pulvinar viverra massa, vel mollis tellus faucibus sed. Mauris tortor quam, hendrerit vitae elit ut, interdum finibus sapien. Donec vitae cursus felis. Quisque volutpat blandit purus ut varius. Morbi venenatis urna urna, at feugiat leo vehicula non. Phasellus tempus pretium dolor eu porta. Fusce volutpat, ante vitae sagittis interdum, purus mauris venenatis dolor, et commodo ipsum purus nec ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.`;

    let isTruncated = $derived.by(() => {
        return testNote.length > 700;
    });

    let displayTestNote = $derived.by(() => {
        if (testNote.length > 700) {
            return testNote.slice(0, 700) + '...';
        }
        return testNote;
    });

    let isExpanded = $state(false);
    let noteExpandButtonText = $state('Show More');
    const toggleExpandNote = () => {
        isExpanded = !isExpanded;
        noteExpandButtonText = isExpanded ? 'Show Less' : 'Show More';
    };

    const formatTimeForDurationFormat = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return {
            hours,
            minutes: mins
        };
    };

    const formatDate = (instantStr: string): string => {
        let temporalInstant = Temporal.Instant.from(instantStr);
        return temporalInstant.toLocaleString();
    };

    let editMode = $state(false);
</script>

<div>
    <div class="grid max-w-[100rem] grid-cols-1 gap-4 lg:grid-cols-8">
        <div class="place-self-center lg:col-span-3">{@render image()}</div>
        <div class="lg:col-span-5">{@render metadata()}</div>
        <div class="lg:col-span-2">{@render de('ingredients')}</div>
        <div class="lg:col-span-6">{@render de('instructions')}</div>
    </div>
    <div class="divider"></div>
    <div class="flex flex-row gap-5 text-sm text-base-content/70">
        {@render metadataDateDisplay(PlusCircle, 'Created At', recipe!.createdAt)}
        {@render metadataDateDisplay(Pencil, 'Updated At', recipe!.updatedAt)}
    </div>
</div>

{#snippet de(txt: string)}
    <div class="my-2 rounded-md border bg-amber-500 p-2">{txt}</div>
{/snippet}

{#snippet image()}
    {#if recipe?.coverImage}
        {#await fetchRecipeCover()}
            <div class="skeleton aspect-square h-full w-full"></div>
        {:then res}
            <img src={coverImageUrl} alt="" class="rounded-md" />
        {/await}
    {:else}
        <img src={recipePlaceholder} alt="" />
    {/if}
{/snippet}

{#snippet metadata()}
    <div class="flex h-full flex-col gap-y-5">
        <div class="grow">
            <div>{@render recipeTitle()}</div>
            <div class="divider"></div>
            <div class="grid grid-cols-2 gap-3">
                {@render metadataTimeDisplay(CookingPot, 'Cook Time', 100)}
                {@render metadataTimeDisplay(CirclePause, 'Rest Time', 5)}
                {@render metadataTimeDisplay(Hourglass, 'Total Time', 105)}
                {@render metadataDisplay(HandPlatter, 'Yield', '5 Servings')}
            </div>
            <div class="divider"></div>
            {@render note(testNote)}
        </div>
        <div class="flex justify-between">
            <a
                class="btn btn-soft btn-accent"
                href="https://www.justonecookbook.com/oyakodon/"
                target="_blank"
                rel="noopener noreferrer">Open Original Recipe</a
            >
            <button class="btn btn-soft btn-primary" onclick={() => editMode = !editMode}>Edit Recipe</button>
        </div>
    </div>
{/snippet}

{#snippet recipeTitle()}
    {#if editMode}
        <input type="text" class="input w-full" bind:value={recipe!.title}>
    {:else}
        <h2 class="text-2xl wrap-break-word lg:text-4xl">
            {recipe?.title} aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbb
        </h2>
    {/if}
{/snippet}

{#snippet note(txt: string)}
    {#if isExpanded}
        <p class="text-md my-3">{testNote}</p>
    {:else}
        <p class="text-md my-3">{displayTestNote}</p>
    {/if}

    {#if isTruncated}
        <button class="btn btn-accent btn-outline btn-sm" onclick={toggleExpandNote}
            >{noteExpandButtonText}</button
        >
    {/if}
{/snippet}

{#snippet metadataTimeDisplay(MetadataIcon: typeof Icon, description: string, time: number)}
    {@render metadataDisplay(
        MetadataIcon,
        description,
        durationFormat.format(formatTimeForDurationFormat(time))
    )}
{/snippet}

{#snippet metadataDisplay(MetadataIcon: typeof Icon, description: string, content: string)}
    <div class="flex flex-row gap-2 items-center">
        <MetadataIcon />
        <span>{description}: {content}</span>
    </div>
{/snippet}

{#snippet metadataDateDisplay(MetadataIcon: typeof Icon, description: string, instantStr: string)}
    <div class="flex flex-row gap-2 items-center">
        <MetadataIcon size=18/>
        <span>{description}: {formatDate(instantStr)}</span>
    </div>
{/snippet}

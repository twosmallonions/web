<script lang="ts">
    import { page } from '$app/state';
    import { Frown } from '@lucide/svelte';
</script>

<div class="flex flex-col items-center justify-center mt-32">
    <div class="mb-20">
        <Frown size='20em' class="text-base-content/70"/>
    </div>
    <div>
        <h1 class="text-4xl text-">{page.error?.message}</h1>
    </div>
    <div>
        <h2 class="text-base-content/70 text-xl">HTTP Error {page.status}</h2>
    </div>
</div>
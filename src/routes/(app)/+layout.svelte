<script lang="ts">
    import Sidemenu from '$lib/components/nav/Sidemenu.svelte';
    let { children } = $props()
</script>

<div class="font-display">
    <Sidemenu child={children}/>
</div>

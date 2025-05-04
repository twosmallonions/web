<script lang="ts">
    import MetadataDisplay from "$lib/components/recipe/MetadataDisplay.svelte";
    import MetadataTimeDisplay from "$lib/components/recipe/MetadataTimeDisplay.svelte";
    import { Circle } from "@lucide/svelte";

    let fuck = $state();

    let asd = $state();
</script>

<div>
<MetadataDisplay 
    MetadataIcon={Circle}
    description="fuck this shit"
    editMode={true}
    inputType="text"
    bind:bindValue={fuck}
    content="fuck"
/>

<MetadataTimeDisplay MetadataIcon={Circle} description='test' editMode={true} bind:bindValue={asd} minutes={asd}/>

<div>
    value of fuck: {fuck}
    {JSON.stringify({'asd': fuck})}
</div>

<div>
    value of asd: {asd}
    {JSON.stringify({'asd': asd})}
</div>
</div>
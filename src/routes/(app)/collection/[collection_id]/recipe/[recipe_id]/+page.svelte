<script lang="ts">
    import client from '$lib';

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
        await fetch(`/api/recipe/${recipe!.collection}/${recipe!.id}/cover`, {
            method: 'PUT',
            body: formData,
            headers: { authorization: `Bearer ${data.session?.accessToken}` }
        });
    };

    const fetchRecipeCover = async () => {
        console.log("HERE")
        console.log(recipe?.coverImage)
        if (!recipe?.coverImage) {
            return;
        }
        
        console.log('here')
        const res = await fetch(recipe.coverImage, {
            headers: { authorization: `Bearer ${data.session?.accessToken}` }
        });

        console.log(res)
        const coverBlob = await res.blob()
        coverImageUrl = URL.createObjectURL(coverBlob);
    };

</script>

{JSON.stringify(data.recipe)}
<br />
<input type="file" class="file-input" accept="image/*" bind:files />
<br />

<button class="btn" onclick={uploadCover}>Upload</button>

{#await fetchRecipeCover()}
    loading
{:then res} 
    <img src={coverImageUrl} alt="" srcset="">
{/await}
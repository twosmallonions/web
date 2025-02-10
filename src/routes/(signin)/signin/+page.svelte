<script lang="ts">
    import "../../../app.css"
    import { signIn } from "@auth/sveltekit/client"
    import { onMount } from "svelte";
    onMount(() => {
        document.getElementById("signin")?.click();
    })
</script>

<div class="flex h-full bg-base-100">
    <button on:click={() => signIn("keycloak", {callbackUrl: ""})} id="signin">Signin</button>
</div>
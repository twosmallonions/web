<script>
    import { SignIn } from "@auth/sveltekit/components";
    import "../../../app.css"
    const signInOptions = {
        'redirect': true,
        'redirectTo': '/'
    }
</script>
<div class="flex h-full bg-base-100 flex-col items-center gap-8">
    <div>
        <h1 class="text-2xl">Sign in</h1>
    </div>
    <div>
        <SignIn provider="keycloak" options={signInOptions}>
            <div slot="submitButton">
                <button class="btn btn-primary">Sign in with Keycloak</button>
            </div>
        </SignIn>
    </div>
</div>

import { env } from "$env/dynamic/private";
import { SvelteKitAuth } from "@auth/sveltekit";
import Keycloak from "@auth/sveltekit/providers/keycloak"

declare module "@auth/sveltekit" {
    interface Session {
        accessToken?: string,
    }
}

declare module "@auth/core/jwt" {
    /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
    interface JWT {
        /** OpenID ID Token */
        accessToken?: string
    }
}

export const { handle, signIn } = SvelteKitAuth({
    session: {
        strategy: "jwt"
    },
    providers: [Keycloak({
        clientId: env.AUTH_KEYCLOAK_ID,
        clientSecret: env.AUTH_KEYCLOAK_SECRET,
        issuer: env.AUTH_KEYCLOAK_ISSUER
    })],
    callbacks: {
        async jwt({token, account}) {
            if (account) {
                return {...token, accessToken: account?.access_token}
            }
            return token
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;

            return session
        }
    }

})
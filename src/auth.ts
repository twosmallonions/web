import { env } from '$env/dynamic/private';
import { TOKEN_ENDPOINT } from '$env/static/private';
import type { Provider } from '@auth/core/providers';
import { SvelteKitAuth } from '@auth/sveltekit';
import Keycloak from '@auth/sveltekit/providers/keycloak';

declare module '@auth/sveltekit' {
    interface Session {
        accessToken: string;
        error?: string;
    }
}

declare module '@auth/core/jwt' {
    /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
    interface JWT {
        /** OpenID ID Token */
        accessToken: string;
        expiresAt: number;
        refreshToken: string;
        error?: string;
    }
}

const providers: Provider[] = [
    Keycloak({
        clientId: env.AUTH_KEYCLOAK_ID,
        clientSecret: env.AUTH_KEYCLOAK_SECRET,
        issuer: env.AUTH_KEYCLOAK_ISSUER
    })
];

export const providerMap = providers.map((provider) => {
    if (typeof provider === "function") {
        const providerData = provider();
        return { id: providerData.id, name: providerData.name }
    } else {
        return {id: provider.name, name: provider.name}
    }
})

export const { handle, signIn } = SvelteKitAuth({
    basePath: '/',
    session: {
        strategy: 'jwt'
    },
    providers,
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                if (!account.access_token || !account.expires_at || !account.refresh_token) {
                    throw new Error("AAAHH");
                }
                return { ...token, accessToken: account.access_token, expiresAt: account.expires_at, refreshToken: account.refresh_token };
            }
            console.log(Date.now(), token.expiresAt * 1000)
            if (Date.now() < token.expiresAt * 1000) {
                console.log("token still ok");
                return token;
            }

            try {
                console.log("refreshing token");
                const response = await fetch(TOKEN_ENDPOINT,{
                    method: "POST",
                    body: new URLSearchParams({
                        client_id: env.AUTH_KEYCLOAK_ID,
                        client_secret: env.AUTH_KEYCLOAK_SECRET,
                        grant_type: "refresh_token",
                        refresh_token: token.refreshToken
                    })
                });

                const tokensOrError = await response.json();

                if (!response.ok) throw tokensOrError;

                const newTokens = tokensOrError as {
                    access_token: string,
                    expires_in: number,
                    refresh_token: string
                }

                console.log(Math.floor(Date.now() / 1000 + newTokens.expires_in))
                return {
                    ...token,
                    accessToken: newTokens.access_token,
                    expiresAt: Math.floor(Date.now() / 1000 + newTokens.expires_in),
                    refreshToken: newTokens.refresh_token ? newTokens.refresh_token : token.refreshToken
                }
            } catch (error) {
                console.error("Error refreshing access token", error);
                token.error = "RefreshTokenError";
                return token;
            }
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.error = token.error;

            return session;
        }
    },
});

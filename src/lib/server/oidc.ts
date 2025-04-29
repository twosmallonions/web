import { AUTH_KEYCLOAK_ID, AUTH_KEYCLOAK_ISSUER, AUTH_KEYCLOAK_SECRET } from '$env/static/private';
import {
    discovery,
    buildAuthorizationUrl,
    randomPKCECodeVerifier,
    calculatePKCECodeChallenge,
    randomState,
    authorizationCodeGrant,
    refreshTokenGrant
} from 'openid-client';
import { getDelAuthState, getSession, insertAuthState, insertSession, type UserSession } from './db';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { Temporal } from 'temporal-polyfill';

const config = await discovery(
    new URL(AUTH_KEYCLOAK_ISSUER),
    AUTH_KEYCLOAK_ID,
    AUTH_KEYCLOAK_SECRET
);

const JWKS = createRemoteJWKSet(new URL(config.serverMetadata().jwks_uri!));

export const genAuthorizationUrl = async (redirectBase: string) => {
    const codeVerifier = randomPKCECodeVerifier();
    const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);
    const state = randomState();
    const redirectUri = new URL(redirectBase);
    redirectUri.pathname = '/oidc/callback'

    await insertAuthState(codeVerifier, state);

    return buildAuthorizationUrl(config, {
        redirect_uri: redirectUri.toString(),
        scope: 'openid email',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        state: state
    })
};

export const newSession = async (url: URL): Promise<UserSession> => {
    const authState = await getDelAuthState(url.searchParams.get('state')!)
    const token = await authorizationCodeGrant(config, url, {
        expectedState: authState['state'],
        idTokenExpected: true,
        pkceCodeVerifier: authState['code_verifier']
    });

    const claims = await verifyIdToken(token.id_token!);
    const sessionId = genSessionId();
    return await insertSession({
        sessionId,
        accessToken: token.access_token,
        idToken: token.id_token!,
        refreshToken: token.refresh_token!,
        accessExpiresIn: token.expires_in!,
        refreshExpiresIn: <number> token['refresh_expires_in']!,
        ...claims
    });
}

const refreshSession = async(session: UserSession): Promise<UserSession> => {
    const token = await refreshTokenGrant(config, session.refreshToken);

    const claims = await verifyIdToken(token.id_token!);
    return await insertSession({
        sessionId: session.sessionId,
        accessToken: token.access_token,
        idToken: token.id_token!,
        refreshToken: token.refresh_token!,
        accessExpiresIn: token.expires_in!,
        refreshExpiresIn: <number> token['refresh_expires_in']!,
        ...claims
    });
}

const DURATION_BEFORE_REFRESH = Temporal.Duration.from({seconds: 20});

export interface UserSessionWithRefreshInformation extends UserSession {
    refreshed: boolean
} 

export const getOrRefreshSession = async (sessionId: string): Promise<UserSessionWithRefreshInformation | undefined> => {
    const session = await getSession(sessionId);
    if (!session) {
        return undefined;
    }
    const accessValidFor = session.accessExpiresAt.since(Temporal.Now.instant());
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Duration/sign
    // 1 = postive, 0 = zero, -1 = negative
    if (accessValidFor.subtract(DURATION_BEFORE_REFRESH).sign <= 0) {
        return {...await refreshSession(session), refreshed: true};
    }

    return {...session, refreshed: false};
}

const genSessionId = (): string => {
    const buf = Buffer.alloc(32)
    crypto.getRandomValues(buf)

    return buf.toString('base64url').replace(/=+/, '');
}

interface JWTClaims {
    iss: string;
    sub?: string;
    sid?: string;
}

const verifyIdToken = async (jwt: string): Promise<JWTClaims> => {
    const {payload} = await jwtVerify<JWTClaims>(jwt, JWKS, {
        algorithms: config.serverMetadata().id_token_signing_alg_values_supported!,
        audience: AUTH_KEYCLOAK_ID,
        clockTolerance: 5,
        issuer: config.serverMetadata().issuer!,
    });

    return payload;
}
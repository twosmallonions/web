import { DATABASE_URL } from '$env/static/private';
import { Pool, type PoolClient } from 'pg';

import { Temporal } from 'temporal-polyfill';

export const migration = `BEGIN;
CREATE SCHEMA IF NOT EXISTS tso_web;
CREATE TABLE IF NOT EXISTS tso_web.session (
    session_id TEXT PRIMARY KEY,
    access_token TEXT NOT NULL,
    id_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    access_expires_in INT NOT NULL,
    refresh_expires_in INT NOT NULL,
    access_expires_at TIMESTAMPTZ NOT NULL,
    refresh_expires_at TIMESTAMPTZ NOT NULL,
    iss TEXT NOT NULL,
    sid TEXT,
    sub TEXT
);

CREATE TABLE IF NOT EXISTS tso_web.auth_state (
    code_verifier TEXT NOT NULL,
    state TEXT PRIMARY KEY,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + '5 minutes'
);
COMMIT;`;

const dbPool = new Pool({
    connectionString: DATABASE_URL,
    connectionTimeoutMillis: 5000
});

export const getDbConnection = async () => {
    return await dbPool.connect();
};

export const insertAuthState = async (codeVerifier: string, state: string) => {
    await dbPool.query('INSERT INTO tso_web.auth_state VALUES ($1::text, $2::text)', [
        codeVerifier,
        state
    ]);
};

export interface AuthState {
    codeVerifier: string;
    state: string;
}

export const getDelAuthState = async (state: string): Promise<AuthState | undefined> => {
    let conn: PoolClient | undefined;
    try {
        const conn = await getDbConnection();

        await conn.query('BEGIN');
        var result = await conn.query(
            `SELECT code_verifier, state 
    FROM tso_web.auth_state
    WHERE state = $1::text AND expires_at > now()`,
            [state]
        );

        await conn.query('DELETE FROM tso_web.auth_state WHERE state = $1::text', [state]);
        await conn.query('COMMIT');

    } finally {
        if (conn) {
            console.log('conn release')
            conn.release();
        }
    }
    if (result.rows.length === 0) {
        return undefined;
    }

    const row = result.rows[0];
    return {
        codeVerifier: row['code_verifier'],
        state: row['state']
    };
};

export interface NewUserSession {
    sessionId: string;
    accessToken: string;
    idToken: string;
    refreshToken: string;
    accessExpiresIn: number;
    refreshExpiresIn: number;
    iss: string;
    sid?: string;
    sub?: string;
}

export interface UserSession extends NewUserSession {
    createdAt: Temporal.Instant;
    updatedAt: Temporal.Instant;
    accessExpiresAt: Temporal.Instant;
    refreshExpiresAt: Temporal.Instant;
}

export const insertSession = async (session: NewUserSession): Promise<UserSession> => {
    const query = `
INSERT INTO tso_web.session
    (session_id, access_token, id_token, refresh_token, access_expires_in,
    refresh_expires_in, access_expires_at, refresh_expires_at, iss, sid, sub)
VALUES 
($1::text, $2::text, $3::text, $4::text, $5::integer, $6::integer,
$7::timestamptz, $8::timestamptz, $9::text, $10::text, $11::text)
ON CONFLICT (session_id) DO UPDATE SET
    access_token = EXCLUDED.access_token,
    id_token = EXCLUDED.id_token,
    refresh_token = EXCLUDED.refresh_token,
    access_expires_in = EXCLUDED.access_expires_in,
    refresh_expires_in = EXCLUDED.refresh_expires_in,
    access_expires_at = EXCLUDED.access_expires_at,
    refresh_expires_at = EXCLUDED.refresh_expires_at,
    iss = EXCLUDED.iss,
    sid = EXCLUDED.sid,
    sub = EXCLUDED.sub,
    updated_at = now()
RETURNING *`;

    const now = Temporal.Now.instant();
    const accessExpiresAt = now.add(Temporal.Duration.from({ seconds: session.accessExpiresIn }));
    const refreshExpiresAt = now.add(Temporal.Duration.from({ seconds: session.refreshExpiresIn }));

    const result = await dbPool.query(query, [
        session.sessionId,
        session.accessToken,
        session.idToken,
        session.refreshToken,
        session.accessExpiresIn,
        session.refreshExpiresIn,
        accessExpiresAt.toJSON(),
        refreshExpiresAt.toJSON(),
        session.iss,
        session.sid,
        session.sub
    ]);

    return {
        ...session,
        accessExpiresAt,
        refreshExpiresAt,
        createdAt: result.rows[0]['created_at'],
        updatedAt: result.rows[0]['updated_at']
    };
};

const instantFromDate = (date: Date): Temporal.Instant => {
    return Temporal.Instant.fromEpochMilliseconds(date.valueOf());
};

export const getSession = async (sessionId: string): Promise<UserSession | undefined> => {
    const query = `SELECT * FROM tso_web.session
WHERE session_id = $1::text AND refresh_expires_at > now()`;
    const result = await dbPool.query(query, [sessionId]);

    if (result.rows.length === 0) {
        return undefined;
    }

    const row = result.rows[0];

    const userSession: UserSession = {
        sessionId: row['session_id'],
        accessToken: row['access_token'],
        idToken: row['id_token'],
        refreshToken: row['refresh_token'],
        createdAt: instantFromDate(row['created_at']),
        updatedAt: instantFromDate(row['updated_at']),
        accessExpiresIn: row['access_expires_in'],
        refreshExpiresIn: row['refresh_expires_in'],
        accessExpiresAt: instantFromDate(row['access_expires_at']),
        refreshExpiresAt: instantFromDate(row['refresh_expires_at']),
        iss: row['iss'],
        sid: row['sid'] ?? undefined,
        sub: row['sub'] ?? undefined
    };

    return userSession;
};

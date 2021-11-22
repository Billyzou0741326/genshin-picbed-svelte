import mysql from 'mysql2';
import config from '$lib/config';
import type { RowDataPacket } from 'mysql2';
import type { User, UserCredentials, UserTokens, Tokens } from '$lib/users/model';

interface ITables {
    user:  string;
    token: string;
}

const cfg = config.mysql;
const syncPool = mysql.createPool(cfg);
const pool = syncPool.promise();

const tables = {
    user:  'web_user',
    token: 'web_token',
} as ITables;

export async function getUserByUsername(username: string): Promise<UserCredentials | null> {
    const query = `
        SELECT usr.user_id,
               usr.username,
               usr.web_darkmode AS dark_mode,
               usr.hashed_password,
               usr.salt
        FROM ${tables.user} AS usr
        WHERE usr.username = ?;
    `;
    const query_data = [username];
    const [ rows, _ ] = await pool.query(query, query_data);
    const r = rows as RowDataPacket[];
    if (r.length === 0)
        return null;
    return r[0] as UserCredentials;
}

export async function getUserByToken(refresh_token: string): Promise<UserTokens | null> {
    const query = `
        SELECT usr.user_id,
               usr.username,
               usr.web_darkmode AS dark_mode,
               tk.refresh_token,
               tk.expires_at,
               FROM_UNIXTIME(tk.created_at) as created_at
        FROM ${tables.token} AS tk
            INNER JOIN ${tables.user} AS usr
            ON tk.user_id = usr.user_id
        WHERE tk.refresh_token = ?;
    `;
    const query_data = [refresh_token];
    const [ rows, _ ] = await pool.query(query, query_data);
    const r = rows as RowDataPacket[];
    if (r.length === 0)
        return null;
    return {
        user_id: r[0].user_id,
        username: r[0].username,
        dark_mode: r[0].dark_mode,
        tokens: {
            refresh_token: r[0].refresh_token,
            expires_at: r[0].expires_at,
            created_at: r[0].created_at,
        },
    } as UserTokens;
}

export async function getCurrentTokenByOldToken(refresh_token: string): Promise<Tokens[] | null> {
    const query = `
        SELECT tk.refresh_token,
               tk.expires_at,
               FROM_UNIXTIME(tk.created_at) as created_at
        FROM ${tables.token} AS tk
        WHERE tk.previous_token = ?;
    `;
    const query_data = [refresh_token];
    const [ rows, _ ] = await pool.query(query, query_data);
    const r = rows as RowDataPacket[];
    if (r.length === 0) {
        return null;
    }
    return r.map((token: any) => ({
        refresh_token: token.refresh_token,
        expires_at: token.expires_at,
        created_at: token.created_at,
    } as Tokens));
}

export async function removeTokens(refresh_token_list: string[]) {
    if (refresh_token_list.filter((token: string) => (token.length > 0)).length === 0) {
        return;
    }
    const conditions = refresh_token_list.map(() => ('refresh_token = ?'));
    const condition = conditions.join(' OR ');
    const query = `
        DELETE FROM ${tables.token} WHERE ${condition};
    `;
    const query_data = refresh_token_list;
    await pool.query(query, query_data);
}

export async function saveRefreshTokenByUserid(user_id: number, tokens: Tokens) {
    const query = `
        INSERT INTO ${tables.token} (
            user_id, refresh_token, expires_at
        ) VALUES (
            ?, ?, ?
        );
    `;
    const query_data = [ user_id, tokens.refresh_token, tokens.expires_at ];
    await pool.query(query, query_data);
}

export async function addUser(user: UserCredentials): Promise<User> {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {
        // 1. Insert user
        let query = `
            INSERT INTO ${tables.user} (
                username, web_darkmode, hashed_password, salt
            ) VALUES (
                ?, ?, ?, ?
            );
        `;
        let query_data = [ user.username, user.dark_mode, user.hashed_password, user.salt ];
        await conn.query(query, query_data);
        // 2. Select user
        query = `
            SELECT usr.user_id,
                   usr.username,
                   usr.web_darkmode AS dark_mode
            FROM ${tables.user} AS usr
            WHERE usr.username = ?;
        `;
        query_data = [ user.username ];
        const [ rows, _ ] = await conn.query(query, query_data);
        const r = rows as RowDataPacket[];
        await conn.commit();
        return r[0] as User;
    } finally {
        conn.release();
    }
}

export async function renewToken(user_id: number, tokens: Tokens, old_refresh_token: string) {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {
        // 1. Renew token
        let query = `
            INSERT INTO ${tables.token} (
                user_id, refresh_token, expires_at, previous_token
            ) VALUES (
                ?, ?, ?, ?
            );
        `;
        let query_data = [ user_id, tokens.refresh_token, tokens.expires_at, old_refresh_token ];
        await conn.query(query, query_data);
        // 2. Remove old token
        query = `DELETE FROM ${tables.token} WHERE refresh_token = ?;`;
        query_data = [ old_refresh_token ];
        await conn.query(query, query_data);
        await conn.commit();
    } finally {
        conn.release();
    }
}

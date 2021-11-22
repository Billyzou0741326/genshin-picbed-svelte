import * as repo from '$lib/users/repository';
import * as auth from '$lib/users/authenticate';
import { v4 as uuid } from '@lukeed/uuid/secure';
import { toUser } from '$lib/users/model';
import type { Tokens, UserTokens } from '$lib/users/model';
import log from '$lib/log';

export async function post({ path, body, headers, locals }) {
    log.info({ path, body, headers, locals }, `POST - ${path}`);

    // 1. New tokens
    const userTokens = await renew(locals.refresh_token);
    if (userTokens === null) {
        return {
            status: 401,
            body: {
                error: 'invalid token or token has been renewed',
            },
        };
    }
    const refresh_token = userTokens.tokens.refresh_token;
    const refresh_token_expiry = (new Date(userTokens.tokens.expires_at * 1000)).toUTCString();

    // 2. Jwt
    const userView = toUser(userTokens);
    const jwt_token = await auth.signJwt(userView, { expiresIn: '15m' });

    return {
        headers: {
            'set-cookie': `refresh_token=${refresh_token}; Expires=${refresh_token_expiry}; Path=/; HttpOnly; Secure`,
        },
        body: {
            ...userView,
            jwt_token: jwt_token,
        },
    };
}

async function renew(refresh_token: string): Promise<UserTokens | null> {
    // TODO: invalidate conflicting tokens
    //   - when `refresh_token` is found as an old token associated with new token,
    //     invalididate it (someone else requested for the new token).
    //   - `.getCurrentTokenByOldToken()`

    // 1. Validate token
    const [ user, newTokens ] = await Promise.all([
        repo.getUserByToken(refresh_token),
        repo.getCurrentTokenByOldToken(refresh_token),
    ]);
    if (user === null) {
        const recentRenewal = newTokens && newTokens.some(
            (token: Tokens) => (token.created_at && Date.now() / 1000 - token.created_at < 10));
        if (recentRenewal) {
            const user = await repo.getUserByToken(newTokens[0].refresh_token);
            return {
                ...user,
                tokens: newTokens[0],
            };
        }
        if (newTokens !== null) {
            await repo.removeTokens(newTokens.map((token: Tokens) => (token.refresh_token)));
        }
        return null;
    }

    // 3. Generate new token
    const new_refresh_token = uuid();
    const expires_at = Math.floor(Date.now() / 1000 + 86400 * 30);
    const tokens: Tokens = {
        refresh_token: new_refresh_token,
        expires_at: expires_at,
    };
    await repo.renewToken(user.user_id, tokens, refresh_token);
    const userTokens: UserTokens = {
        ...user,
        tokens: tokens,
    };
    return userTokens;
}

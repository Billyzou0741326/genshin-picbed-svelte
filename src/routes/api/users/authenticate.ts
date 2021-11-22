import { v4 as uuid } from '@lukeed/uuid/secure';
import * as repo from '$lib/users/repository';
import * as auth from '$lib/users/authenticate';
import log from '$lib/log';
import { toUser } from '$lib/users/model';
import type { User as UserBase, UserTokens } from '$lib/users/model';

export interface User extends UserBase {
    jwt_token: string;
}

enum AuthenticateError {
    USERNAME_NOT_FOUND,
    INVALID_PASSWORD,
};

export async function get({ path, headers, locals }) {
    log.info({ path, headers, locals }, `GET - ${path}`);

    let jwt_token = locals.jwt_token || '';
    let refresh_token = locals.refresh_token || '';

    // 1. Jwt authentication
    if (jwt_token) {
        try {
            const decoded = await auth.verifyJwt(jwt_token);
            const user = toUser(decoded);
            log.info({ jwt: decoded }, `Jwt decoded`);
            return {
                body: {
                    ...user,
                    jwt_token: jwt_token,
                },
            }
        } catch (error) {
            log.error({ err: error}, 'failed to verify jwt');
        }
    }

    // 2. Refresh token authentication
    const user = await repo.getUserByToken(refresh_token);
    if (user === null) {
        return {
            status: 401,
        };
    }

    // 3. Jwt
    const userView = {
        user_id: user.user_id,
        username: user.username,
        dark_mode: user.dark_mode,
    } as User;
    jwt_token = await auth.signJwt(userView, { expiresIn: '15m' });

    return {
        body: {
            ...userView,
            jwt_token: jwt_token,
        },
    };
}

export async function post({ path, headers, body, locals }) {
    log.info({ path, body, headers, locals }, `POST - ${path}`);

    if (!body) {
        return {
            status: 400,
            error: new Error('Invalid request'),
        };
    }

    // 1. Check if refresh token is valid
    let jwt_token = locals.jwt_token || '';
    let refresh_token = locals.refresh_token || '';
    let user: UserTokens = await repo.getUserByToken(refresh_token);
    if (user !== null) {
        const userView = toUser(user);
        jwt_token = await auth.signJwt(userView, { expiresIn: '15m' });
        return {
            body: {
                ...userView,
                jwt_token: jwt_token,
            }
        };
    }

    // 2. Authenticate
    const username = body.username;
    const password = body.password;
    const result = await authenticate(username, password);
    if (result === AuthenticateError.USERNAME_NOT_FOUND || result === AuthenticateError.INVALID_PASSWORD) {
        return {
            status: 401,
            body: {
                error: 'incorrect username or password',
            },
        };
    }
    user = result as UserTokens;
    refresh_token = user.tokens.refresh_token;
    const refresh_token_expiry = (new Date(user.tokens.expires_at * 1000)).toUTCString();

    // 3. JWT
    const userView = toUser(user);
    jwt_token = await auth.signJwt(userView, { expiresIn: '15m' });

    return {
        headers: {
            'set-cookie': `refresh_token=${refresh_token}; Expires=${refresh_token_expiry}; Path=/; HttpOnly; Secure`,
        },
        body: {
            user: {
                ...userView,
                jwt_token: jwt_token,
            },
        },
    };
}

async function authenticate(username: string, password: string): Promise<UserTokens | AuthenticateError> {
    // 1. Get user
    const user = await repo.getUserByUsername(username);
    if (user === null) {
        return AuthenticateError.USERNAME_NOT_FOUND;
    }

    // 2. Compute salt
    const hashed_password = auth.hashPassword(password, user.salt);
    if (hashed_password !== user.hashed_password) {
        return AuthenticateError.INVALID_PASSWORD;
    }

    // 3. Generate tokens
    const refresh_token = uuid();
    const expires_at = Math.floor(Date.now() / 1000 + 86400 * 30);
    await repo.saveRefreshTokenByUserid(user.user_id, { refresh_token, expires_at: expires_at });

    return {
        user_id:   user.user_id,
        username:  user.username,
        dark_mode: user.dark_mode,
        tokens: {
            refresh_token: refresh_token,
            expires_at: expires_at,
        },
    } as UserTokens;
}

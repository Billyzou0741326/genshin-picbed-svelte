import { v4 as uuid } from '@lukeed/uuid/secure';
import * as auth from '$lib/users/authenticate';
import * as repo from '$lib/users/repository';
import type { User, UserCredentials } from '$lib/users/model';
import log from '$lib/log';

export async function post({ path, headers, body }) {
    log.info({ path, body, headers }, `POST - ${path}`);

    let username: string = '';
    let password: string = '';
    if (headers['content-type'] === 'application/x-www-form-urlencoded') {
        username = body.get('username') || '';
        password = body.get('password') || '';
    } else if (headers['content-type'] === 'application/json') {
        username = body.username || '';
        password = body.password || '';
    } else {
        return {
            status: 400,
            body: {
                error: 'invalid content type',
            },
        };
    }
    if (username.length < 4) {
        return {
            status: 401,
            body: {
                error: 'username must be 4 characters or longer',
            },
        };
    }
    if (password.length < 8) {
        return {
            status: 401,
            body: {
                error: 'password must be 8 characters or longer',
            }
        };
    }
    const salt = uuid();
    const hashedPassword = auth.hashPassword(password, salt);
    const user: UserCredentials = {
        user_id: 0,
        username: username,
        hashed_password: hashedPassword,
        salt: salt,
        dark_mode: 0,
    };
    try {
        const userView: User = await repo.addUser(user);
        return {
            body: {
                user: userView,
                error: null,
            },
        };
    } catch (error) {
        log.error({ err: error, user: user }, 'failed to sign up user');
        return {
            error: error,
        };
    }
}

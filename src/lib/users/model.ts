import pick from 'lodash/pick.js';

export interface User {
    user_id:         number;
    username:        string;
    dark_mode:       number;
}
export interface UserCredentials extends User {
    hashed_password: string;
    salt:            string;
}
export interface UserTokens extends User {
    tokens: Tokens;
}
export interface Tokens {
    refresh_token:   string;
    expires_at:      number;
    created_at?:     number;
}

export function toUser(obj: any): User {
    return pick(obj, ['user_id', 'username', 'dark_mode']);
}

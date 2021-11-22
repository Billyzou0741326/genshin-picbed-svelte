import crypto from 'crypto';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import config from '$lib/config';

let jwt_public_key = null;
let jwt_private_key = null;

async function getJwtKeys() {
    if (jwt_public_key && jwt_private_key) {
        return {
            public_key: jwt_public_key,
            private_key: jwt_private_key,
        };
    }
    const [ public_key_str, private_key_str ] = await Promise.all([
        fs.promises.readFile(config.jwt.public_key),
        fs.promises.readFile(config.jwt.private_key),
    ]);
    const public_key = jwt_public_key = crypto.createPublicKey(public_key_str);
    const private_key = jwt_private_key = crypto.createPrivateKey(private_key_str);
    return {
        public_key: public_key,
        private_key: private_key,
    };
}

export async function verifyJwt(payload: any, options?: any) {
    if (!options) {
        options = {};
    }
    options.algorithms = ['ES512'];
    const keys = await getJwtKeys();
    return jwt.verify(payload, keys.public_key, options);
}

export async function signJwt(payload: any, options?: any): Promise<string> {
    if (!options) {
        options = {};
    }
    options.algorithm = 'ES512';
    const keys = await getJwtKeys();
    const token = jwt.sign(payload, keys.private_key, options);
    return token;
}

export function hashPassword(password: string, salt: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(`${password}${salt}`);
    const hashed_password = hash.digest('hex');
    return hashed_password;
}

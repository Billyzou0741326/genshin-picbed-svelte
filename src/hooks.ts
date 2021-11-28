import cookie from 'cookie';
import { v4 as uuid } from '@lukeed/uuid';
import type { Handle, GetSession } from '@sveltejs/kit';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';
import config from '$lib/config';

export const handle: Handle = async ({ request, resolve }) => {
    const cookies = cookie.parse(request.headers.cookie || '');
    request.locals.userid = cookies.userid || uuid();

    // TODO https://github.com/sveltejs/kit/issues/1046
    if (request.query.has('_method')) {
        request.method = request.query.get('_method').toUpperCase();
    }

    const response = await resolve(request);

    if (!cookies.userid) {
        // if this is the first time the user has visited this app,
        // set a cookie so that we recognise them when they return
        response.headers['set-cookie'] = `userid=${request.locals.userid}; Path=/; HttpOnly`;
    }

    return response;
};

export const getSession: GetSession = (request: ServerRequest) => {
    const urls = getUrls();
    const googleConfig = getGoogleConfig();
    return {
        ...urls,
        google: googleConfig,
    };
};

function getUrls() {
    let apiBaseUrl = '';
    let imageBaseUrl = '';
    if (config.api.host) {
        apiBaseUrl = config.api.noHttps ? `http://${config.api.host}` : `https://${config.api.host}`;
    }
    if (config.image.host) {
        imageBaseUrl = config.image.noHttps ? `http://${config.image.host}` : `https://${config.image.host}`;
    }
    return {
        apiBaseUrl: apiBaseUrl,
        imageBaseUrl: imageBaseUrl,
    };
}

function getGoogleConfig() {
    const apiKey = config.google.api_key;
    const clientId = config.google.client_id;
    return {
        apiKey,
        clientId,
    };
}

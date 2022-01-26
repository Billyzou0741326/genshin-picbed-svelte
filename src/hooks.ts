import cookie from 'cookie';
import { v4 as uuid } from '@lukeed/uuid';
import type { Handle, GetSession } from '@sveltejs/kit';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';
import config from '$lib/config';
import log from '$lib/log';

export const handle: Handle = async ({ event, resolve }) => {
    const query = event.url.searchParams;
    const request = event.request;
    const cookies = cookie.parse(request.headers.get('cookie') || '');
    event.locals.userid = cookies.userid || uuid();

    // TODO https://github.com/sveltejs/kit/issues/1046
    if (query.has('_method')) {
        request.method = query.get('_method').toUpperCase();
    }

    const response = await resolve(event);

    if (!cookies.userid) {
        // if this is the first time the user has visited this app,
        // set a cookie so that we recognise them when they return
        response.headers['set-cookie'] = `userid=${event.locals.userid}; Path=/; HttpOnly`;
    }

    return response;
};

export const getSession: GetSession = (event) => {
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
    let nsfwEndpoint = '';
    if (config.nsfw_endpoint) {
        nsfwEndpoint = config.nsfw_endpoint;
    }
    if (config.api.host) {
        apiBaseUrl = config.api.noHttps ? `http://${config.api.host}` : `https://${config.api.host}`;
    }
    if (config.image.host) {
        imageBaseUrl = config.image.noHttps ? `http://${config.image.host}` : `https://${config.image.host}`;
    }
    return {
        apiBaseUrl,
        imageBaseUrl,
        nsfwEndpoint,
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

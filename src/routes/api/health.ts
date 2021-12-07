import log from '$lib/log';
import * as repo from '$lib/pixiv/v2/repository';

export async function get({ path, query }) {
    return {
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: {},
    };
}


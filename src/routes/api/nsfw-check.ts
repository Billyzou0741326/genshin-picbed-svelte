import log from '$lib/log';
import config from '$lib/config';

export async function post({ path, body, headers, method }) {
    //log.info({ request.path, request.body }, `POST - ${request.path}`);
    log.info({}, `POST - /api/nsfw-check`);
    log.info({ path }, `POST - ${path}`);
    //for (const k of body.keys()) {
    //    log.info({ k }, '');
    //}
    const res = await fetch(config.nsfw_endpoint, {
        method,
        headers,
        body,
    });
    const d = await res.json();

    return {
        status: 200,
        body: {
            data: d,
        },
    };
}


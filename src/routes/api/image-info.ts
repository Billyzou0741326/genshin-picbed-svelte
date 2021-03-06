import log from '$lib/log';
import * as repo from '$lib/pixiv/v2/repository';

export async function get({ url }) {
    const path = url.pathname;
    const query = url.searchParams;
    log.info({ path, query }, `GET - ${path}`);

    const idList = (query.getAll('ids[]') || []).map(str => Number(str)).filter(val => !isNaN(val));
    const results = await repo.getImagesByIds(idList);
    return {
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: {
            time: (new Date).getTime(),
            data: results,
        },
    };
}


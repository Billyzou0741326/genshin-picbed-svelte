import log from '$lib/log';
import * as repo from '$lib/pixiv/v2/repository';

export async function get({ path, query }) {
    log.info({ path, query }, `GET - ${path}`);

    const idList = (query.getAll('ids') || []).map(str => Number(str)).filter(val => !isNaN(val));
    log.info({ idList }, 'Getting ids');
    const results = await repo.getImagesByIds(idList);
    return {
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: {
            time: (new Date).getTime(),
            data: results,
        },
    };
}


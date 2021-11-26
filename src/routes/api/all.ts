import log from '$lib/log';
import * as repo from '$lib/pixiv/v2/repository';

export async function get({ path, query }) {
    log.info({ path, query }, `GET - ${path}`);

    const imageType = query.get('type') || ImageType.SFW;
    const results = await repo.getIdsByType(imageType);
    return {
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: {
            time: new Date.getTime(),
            data: results,
        },
    };
}

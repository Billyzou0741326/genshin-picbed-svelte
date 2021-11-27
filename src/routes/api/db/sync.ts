import log from '$lib/log';
import config from '$lib/config';
import * as repo from '$lib/pixiv/v2/repository';
import * as nsfwApi from '$lib/nsfw/api';

export async function post({ path, headers, body }) {
    log.info({ path }, `POST - ${path}`);

    // 1. Authenticate
    if (headers['authorization'] !== `Bearer ${config.db_sync_token}`) {
        return {
            status: 403,
            body: { 'message': 'unauthorized' },
        };
    }

    log.info({}, `Received ${body.length} entries of data`);

    // 2. Database update
    try {
        await repo.saveArtworkMany(body);
        const artworks = await repo.getArtsWithUnknownNSFWEvaluation();
        log.info(`Arts without NSFW evaluation: ${artworks.length}`);

        //const urlMap = nsfwApi.getUrlMapFromArtworks(artworks);
        //nsfwApi.evaluateNSFWMany(urlMap).then(() => {
        //    log.info({}, 'Sync completed');
        //});
    } catch (e) {
        log.error({ err: e }, `API error at /db/sync`);
        return {
            status: 500,
            body: { 'message': e.message },
        };
    }

    return {
        body: { 'message': 'ok' },
    };
}

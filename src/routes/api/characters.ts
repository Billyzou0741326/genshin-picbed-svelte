import log from '$lib/log';
import * as repo from '$lib/pixiv/v2/repository';
import { ImageType } from '$lib/pixiv/v2/repository';
import type { ArtworkInfo as A } from '$lib/pixiv/v2/repository';

export type ArtworkInfo = A;

export async function get({ url }) {
    const path = url.pathname;
    const query = url.searchParams;

    log.info({ path, query }, `GET - ${path}: ${query.toString()}`);

    const imageType = query.get('type') || ImageType.SFW;
    const results = await repo.getIdsByType(imageType);
    return {
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: {
            time: (new Date).getTime(),
            data: results,
        },
    };
}


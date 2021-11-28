import log from '$lib/log';
import * as repo from '$lib/pixiv/v2/repository';
import { ImageType } from '$lib/pixiv/v2/repository';
import type { ArtworkInfo } from '$lib/pixiv/v2/repository';

export type ArtworkInfo = ArtworkInfo;

export async function get({ path, query, params }) {
    log.info({ path, query, params }, `GET - ${path}: ${query.toString()}`);

    const { name } = params;
    const imageType = query.get('type') || ImageType.SFW;
    const results = await repo.getIdsByCharacterAndType(name, ImageType[imageType]);

    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: {
            time: new Date().getTime(),
            data: results,
        },
    };
}

import * as repo from '$lib/pixiv/repository';
import * as svc from '$lib/pixiv/service';
import * as worker from '$lib/pixiv/worker';
import log from '$lib/log';
import { ImageType } from '$lib/pixiv/repository';
import type { ArtworkInfoUri as ArtUri } from '$lib/pixiv/repository';
import type { ArtworkInfoUriExtended } from '$lib/pixiv/service';

export type ArtworkInfoUri = ArtworkInfoUriExtended;

export async function get({ path, query, params }) {
    log.info({ path: path, query: query, params: params }, `GET - ${path}: ${query.toString()}`);

    const { name } = params;
    const page = query.get('page');
    const imageType = query.get('type') || ImageType.SFW;
    const results = await repo.getImagesByCharacterAndType(name, ImageType[imageType], { page: page })
        .then((artworkList: ArtUri[]) => worker.getMissingUri(artworkList))
        .then((artworkList: ArtUri[]) => artworkList.map((artwork: ArtUri) => svc.transformArtworkPath(artwork)));

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

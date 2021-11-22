import fetch from 'node-fetch';
import * as repo from '$lib/pixiv/repository';
import * as tagtool from '$lib/pixiv/tag';
import log from '$lib/log';
import config from '$lib/config';
import type { ArtworkUri, ArtworkInfoUri } from '$lib/pixiv/repository';

let working = false;
(async() => {
    // Start caching image uri's
    if (working) return;
    working = true;
    while (true) {
        const interval = 30 * 1000;    // 5 min
        await Promise.all([
            fetchImageUriForArtsAndSave().catch((error) => log.error({ err: error })),
            fetchCharacterNamesForArtsAndSave().catch((error) => log.error({ err: error })),
        ]);
        await new Promise(resolve => setTimeout(resolve, interval));
    }
})();

export async function getMissingUri(artworkList: ArtworkInfoUri[]): Promise<ArtworkInfoUri[]> {
    const jobs: Promise<void>[] = [];
    for (let art of artworkList) {
        if (art.uris.length > 0)
            continue;
        jobs.push(getImageUriList(art.art_id)
                    .then((artworkUriList: ArtworkUri[]) => { art.uris = artworkUriList })
                    .catch((error) => log.error({ err: error })));
    }
    await Promise.all(jobs);
    return artworkList;
}

/**
 *  Get image uri (list?) by artid
 */
async function getImageUriList(artid: number): Promise<ArtworkUri[]> {
    // 1. Query database
    const artworkUriList: ArtworkUri[] = await repo.getImageUrisByArtid(artid);
    if (artworkUriList && artworkUriList.length > 0) {
        // Found cache
        return artworkUriList;
    }
    // 2. Hit pixiv endpoint
    const uri = detailsUri(artid);
    const res = await fetch(uri, { headers: pixivHeaders() });
    if (!res.ok) {
        throw new Error(`Cannot get ${uri} - ${res.status}`);
    }
    const data = await res.json();
    if (data.error || !data.body || data.body.length === 0) {
        throw new Error(`Cannot get ${uri} - .error or .body invalid - ${data.message}`);
    }
    const uriList = data.body.map((uriList: any) => uriList.urls);
    const uri_json = JSON.stringify(uriList);
    repo.saveImageUrisByArtid(artid, uri_json)
            .catch((error) => log.error({ err: error }));
    return uriList;
}

/**
 *  Gets image uris that don't yet exist in the database
 *  and begins caching them in
 */
async function fetchImageUriForArtsAndSave() {
    let skipCount = 0;
    let errCount = 0;
    const artidList: number[] = await repo.getArtsWithUnknownUri();
    for (const artid of artidList) {
        try {
            await getImageUriList(artid);
        } catch (error) {
            if (error.message.endsWith('404')) {
                skipCount++;
            } else {
                if (errCount < 10) {
                    log.error({ err: error });
                }
                errCount++;
            }
        }
    }
    log.info(`uri cache completed. Skipped ${skipCount}, errored ${errCount}`);
}

async function fetchCharacterNamesForArtsAndSave() {
    const artList = await repo.getArtsWithUnknownCharacters();
    const artIdCharacters = [];
    for (const info of artList) {
        const names = tagtool.characterNamesByTag(info.tags);
        if (names.length === 0)
            continue;
        artIdCharacters.push({ art_id: info.art_id, names: names });
    }
    try {
        await repo.saveImageCharactersByManyArtid(artIdCharacters);
    } catch (error) {
        log.error({ err: error });
        return;
    }
    log.info(`name cache completed`);
}

function detailsUri(artid: number): string {
    return `https://www.pixiv.net/ajax/illust/${artid}/pages`;
}

function userAgent(): string {
    return `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0`;
}

function pixivHeaders() {
    const referrer = `https://www.pixiv.net/`;
    const ua = userAgent();
    return {
        'Cookie': config.pixiv.cookie,
        'Referer': referrer,
        'User-Agent': ua,
    };
}

import log from '$lib/log';
import config from '$lib/config';
import chunk from 'lodash/chunk.js';
import * as repo from '$lib/pixiv/v2/repository';

const NSFW_ENDPOINT = config.nsfw_endpoint;

export function getUrlMapFromArtworks(artworks) {
    // From: { 'art_id': <number>, 'images': [{ urls: { 'small': <url> } }] }
    // To:   { <url>: { 'art_id': <number>, 'index': <number> } }
    const urlMap = {};
    for (const artwork of artworks) {
        for (const [i, image] of artwork.images.entries()) {
            urlMap[image.urls.small] = {
                'art_id': artwork.art_id,
                'index': i,
            };
        }
    }
    return urlMap;
}

export async function evaluateNSFWMany(urlMap) {
    // [ 'url1', 'url2', 'url3', ..., 'url100' ]
    const urls = Object.keys(urlMap);
    // [ ['url1', ..., 'url20'], ['url21', ..., 'url40' ] ]
    const pagedUrls = chunk(urls, 30);
    for (const page of pagedUrls) {
        const result = await evaluateNSFW(page);
        const updates = CreateUpdateFromNSFWApiResponse(result, urlMap);
        const tasks = updates.map((update) =>  (
            repo.saveArtworkImageNSFWSingular(
                update['art_id'],
                update['index'],
                update['nsfw'],
            ).catch((error) => {
                log.error({ err: error }, '');
            })
        ));
        await Promise.all(tasks);
    }
}

function CreateUpdateFromNSFWApiResponse(data, urlMap) {
    const evaluations = data['valid'];
    const updates = [];
    for (const url in evaluations) {
        updates.push({
            art_id: urlMap[url]['art_id'],
            index: urlMap[url]['index'],
            nsfw: evaluations[url],
        });
    }
    const failures = data['invalid'];
    for (const url in failures) {
        updates.push({
            art_id: urlMap[url]['art_id'],
            index: urlMap[url]['index'],
            nsfw: {},
        });
    }
    return updates;
}

async function evaluateNSFW(page) {
    const endpoint = NSFW_ENDPOINT;
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page),
    };
    const res = await fetch(endpoint, options);
    try {
        const body = await res.json();
        return body;
    } catch (e) {
        log.error({ err: e, endpoint, page }, '');
        log.error({ html: res.text }, '');
        throw e;
    }
    /**
     * {"valid":
     *      {"https://i.pximg.net/c/540x540_70/img-master/img/2021/06/22/22/07/58/90740221_p0_master1200.jpg":
     *          {"drawings": 0.8884708881378174,
     *           "hentai":   0.1113944724202156,
     *           "neutral":  6.952802505111322e-05,
     *           "porn":     3.160308551741764e-05,
     *           "sexy":     3.358799949637614e-05
     *          }
     *      },
     *  "invalid":{}
     * }
     */
}

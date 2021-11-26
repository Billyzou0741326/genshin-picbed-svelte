import log from '$lib/log';
import * as repo from '$lib/pixiv/v2/repository';

export async function get({ path, query }) {
    log.info({ path, query }, `GET - ${path}`);

    // Artwork in 30 days
    //   SELECT COUNT(illusts_id) FROM genshin_pixiv_audit WHERE DATEDIFF(CURRENT_TIMESTAMP, FROM_UNIXTIME(upload_timestamp)) < 30;
    // Most recent artwork upload time
    //   SELECT DATEDIFF(NOW(), FROM_UNIXTIME(MAX(upload_timestamp))) FROM genshin_pixiv_audit;
    // Artwork count
    //   SELECT COUNT(illusts_id) FROM genshin_pixiv_audit_sfw;
    //   SELECT COUNT(illusts_id) FROM genshin_pixiv_audit_nsfw;
    //   SELECT COUNT(illusts_id) FROM genshin_pixiv_audit_r18;
    const jobs = [
        repo.getArtworkCount(),
        repo.getLatestUploadedTime(),
        repo.getArtworkCountSFW(),
        repo.getArtworkCountNSFW(),
        repo.getArtworkCountR18(),
    ];
    let artworkResp = {};
    try {
        const [
            artworkCount,
            latestUploadDays,
            artworkCountSFW,
            artworkCountNSFW,
            artworkCountR18,
        ] = await Promise.all(jobs);
        artworkResp = {
            total: artworkCount,
            sfw: artworkCountSFW,
            nsfw: artworkCountNSFW,
            r18: artworkCountR18,
            latestUploadDays: latestUploadDays,
        };
    } catch (error) {
        log.error({ err: error });
        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            status: 500,
        };
    }

    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: {
            time: new Date().getTime(),
            data: {
                artwork: artworkResp,
            },
        },
    };
}

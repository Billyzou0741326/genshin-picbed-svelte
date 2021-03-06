import { MongoClient } from 'mongodb';
import config from '$lib/config';
import log from '$lib/log';

/*
 * Data is stored in the `pixiv` db in the `artworks` collection
 *
 * Indexes for 'art_id', 'upload_timestamp' and 'characters' are created for performance
 *
 * Views for `SFW`, `NSFW`, and `R18` image types are created for ease of query
 *
 * Document format:
 *
    {
        "_id" : ObjectId("61a005945c57670008c7a5ca"),
        "art_id" : 94314043,
        "title" : "申鶴さん",
        "tag_str" : "#原神#申鶴#原神5000users入り",
        "characters" : [
            "Shenhe"
        ],
        "view_count" : 26391,
        "like_count" : 6542,
        "love_count" : 10361,
        "artist_id" : 62635184,
        "upload_timestamp" : 1637614046,
        "is_404" : false,
        "images" : [
            {
                "urls" : {
                        "thumb_mini" : "https://i.pximg.net/c/128x128/custom-thumb/img/2021/11/23/05/47/26/94314043_p0_custom1200.jpg",
                        "small" : "https://i.pximg.net/c/540x540_70/img-master/img/2021/11/23/05/47/26/94314043_p0_master1200.jpg",
                        "regular" : "https://i.pximg.net/img-master/img/2021/11/23/05/47/26/94314043_p0_master1200.jpg",
                        "original" : "https://i.pximg.net/img-original/img/2021/11/23/05/47/26/94314043_p0.png"
                },
                "nsfw" : {
                        "drawings" : 0.9658458828926086,
                        "hentai" : 0.03393279388546944,
                        "neutral" : 0.00015959740267135203,
                        "porn" : 0.00006085155109758489,
                        "sexy" : 9.48483375395881e-7
                }
            }
        ],
        "moderate" : {
            "type" : "SFW",
            "status" : "PUSH",
            "reason" : ""
        }
    }
 *
 */

interface ArtworkInfoBase {
    art_id:           number;
    title:            string;
    tags:             string;
    view_count:       number;
    like_count:       number;
    love_count:       number;
    artist_id:        number;
    upload_timestamp: number;
}
interface ArtworkUri {
    thumb_mini: string;
    small:      string;
    regular:    string;
    original:   string;
}
interface Moderation {
    type:   string;
    status: string;
    reason: string;
}
interface NSFWEvaluation {
    drawings: number;
    hentai:   number;
    neutral:  number;
    porn:     number;
    sexy:     number;
}
interface ArtworkImageInfo {
    urls: ArtworkUri;
    nsfw: NSFWEvaluation;
}
export interface ArtworkInfo extends ArtworkInfoBase {
    images: ArtworkImageInfo[];
    is_404: boolean;
}


export enum ImageType {
    SFW = 'SFW',
    NSFW = 'NSFW',
    R18 = 'R18',
}
export enum ImageStatus {
    INIT = 'INIT',
    PASS = 'PASS',
    REJECT = 'REJECT',
    PUSH = 'PUSH',
}


const pool = (() => {
    const cfg = config.mongodb;
    const client = new MongoClient(cfg.url);
    return () => client.connect();
})();
pool().then((c) => {
    log.info({}, 'Creating indexes and views');
    c.db('pixiv').collection('artworks').createIndexes([
        { key: { art_id: 1 }, unique: true },
        { key: { upload_timestamp: 1 } },
        { key: { characters: 1 } },
        { key: { 'moderate.type': 1 } },
        { key: { 'moderate.status': 1 } },
    ], (e, r) => {});
    c.db('pixiv').createCollection('artworks_sfw', viewOptionsSFW(), (e, r) => {});
    c.db('pixiv').createCollection('artworks_nsfw', viewOptionsNSFW(), (e, r) => {});
    c.db('pixiv').createCollection('artworks_r18', viewOptionsR18(), (e, r) => {});
});

export async function getIdsByType(imageType: ImageType) : Promise<number[]> {
    const artworks = (await pool()).db('pixiv').collection(imageTypeToCollection(imageType));
    const query = [
        { $sort: { 'upload_timestamp': -1 } },
        { $project: { 'art_id': 1 } },
    ];
    const result = await artworks.aggregate(query).toArray();
    return result.map((item) => item['art_id']);
}

export async function getIdsByCharacterAndType(name: string, imageType: ImageType) : Promise<number[]> {
    const artworks = (await pool()).db('pixiv').collection(imageTypeToCollection(imageType));
    const query = [
        { $match: { 'characters': { $regex: name, $options: 'i' } } },
        { $sort: { 'upload_timestamp': -1 } },
        { $project: { 'art_id': 1 } },
    ];
    const result = await artworks.aggregate(query).toArray();
    return result.map((item) => item['art_id']);
}

export async function getImagesByIds(idList: number[]) : Promise<ArtworkInfo[]> {
    if (idList.length === 0) {
        return [];
    }
    const artworks = (await pool()).db('pixiv').collection('artworks');
    const queryMap = idList.map((id: number) => ({ 'art_id': id }));
    const query = [
        { $match: { $or: queryMap } },
    ];
    const result = await artworks.aggregate(query).toArray();
    const idMap = {};
    for (const art of result) {
        idMap[art['art_id']] = art;
    }
    return idList.map((id: number) => idMap[id]);
}

export async function saveArtworkMany(artwork_list: ArtworkInfo[]) {
    const artworks = (await pool()).db('pixiv').collection('artworks');
    const options = {ordered: false};
    const bulkWirteOptions = artwork_list.filter(a => a.art_id).map((artwork) => ({
        'replaceOne': {
            'filter': { 'art_id': artwork.art_id },
            'replacement': artwork,
            'upsert': true,
        },
    }));
    try {
        const result = await artworks.bulkWrite(bulkWirteOptions, options);
    } catch (e: any) {
        if (e.name === 'MongoBulkWriteError') {
            log.warn({ error: e.message, errorLabels: e.errorLabels, name: e.name }, `Database write error at .saveArtworkMany`);
            return;
        }
        throw e;
    }
}

export async function getArtsWithUnknownNSFWEvaluation() {
    const artworks = (await pool()).db('pixiv').collection('artworks');
    const query = {
        'is_404': false,
        'images': {
            $elemMatch: { 'nsfw': { $eq: null } },
        },
    };
    const options = {
        //projection: { 'art_id': 1, 'moderation': 1, 'images': 1 },
    };
    const results = await artworks.find(query, options).toArray();
    return results;
}

async function saveArtworkImageInfo(art_id: number, images: ArtworkImageInfo[]) {
    const artworks = (await pool()).db('pixiv').collection('artworks');
    const query = { 'art_id': art_id };
    const update = {
        '$set': { 'images': images },
    };
    return await artworks.findOneAndUpdate(query, update);
}

export async function saveArtworkImageNSFWSingular(art_id: number, index: number, nsfw: NSFWEvaluation) {
    const artworks = (await pool()).db('pixiv').collection('artworks');
    const query = { 'art_id': art_id };
    const field = `images.${index}.nsfw`;
    const update = { '$set': {} };
    update['$set'][field] = nsfw;
    return await artworks.findOneAndUpdate(query, update);
}

export async function getArtworkCount(): Promise<number> {
    const artworks = (await pool()).db('pixiv').collection('artworks');
    const result = await artworks.count();
    return result;
}

/**
 * Latest uploaded time in X days
 */
export async function getLatestUploadedTime(): Promise<number> {
    const artworks = (await pool()).db('pixiv').collection('artworks');
    const result = await artworks.aggregate([
        { $project: { art_id: 1, upload_timestamp: 1 } },
        { $sort: { upload_timestamp: -1, art_id: 1 } },
        { $limit: 1 },
    ]).toArray();
    if (result.length === 0) {
        return -1;
    }
    const ts = result[0]['upload_timestamp'];
    const daysAgo = Math.floor((Date.now()/1000 - ts) / 86400);
    return ts;
}

export async function getArtworkCountSFW(): Promise<number> {
    const artworks = (await pool()).db('pixiv').collection('artworks_sfw');
    const result = await artworks.count();
    return result;
}

export async function getArtworkCountNSFW(): Promise<number> {
    const artworks = (await pool()).db('pixiv').collection('artworks_nsfw');
    const result = await artworks.count();
    return result;
}

export async function getArtworkCountR18(): Promise<number> {
    const artworks = (await pool()).db('pixiv').collection('artworks_r18');
    const result = await artworks.count();
    return result;
}

function imageTypeToCollection(imageType: ImageType): string {
    let typeToTable = {};
    typeToTable[ImageType.SFW] = 'artworks_sfw';
    typeToTable[ImageType.NSFW] = 'artworks_nsfw';
    typeToTable[ImageType.R18] = 'artworks_r18';
    return typeToTable[imageType];
}

function viewOptionsSFW() {
    return {
        viewOn: 'artworks',
        pipeline: [
            {
                $match: {
                    is_404: { $ne: true },
                    'moderate.type': 'SFW',
                    $or: [
                        { 'moderate.status': 'PASS' },
                        { 'moderate.status': 'PUSH' },
                    ],
                },
            },
        ],
    };
}

function viewOptionsNSFW() {
    return {
        viewOn: 'artworks',
        pipeline: [
            {
                $match: {
                    is_404: { $ne: true },
                    'moderate.type': 'NSFW',
                    $or: [
                        { 'moderate.status': 'PASS' },
                        { 'moderate.status': 'PUSH' },
                    ],
                },
            },
        ],
    };
}

function viewOptionsR18() {
    return {
        viewOn: 'artworks',
        pipeline: [
            {
                $match: {
                    is_404: { $ne: true },
                    'moderate.type': 'R18',
                    $or: [
                        { 'moderate.status': 'PASS' },
                        { 'moderate.status': 'PUSH' },
                    ],
                },
            },
        ],
    };
}

import mysql from 'mysql2';
import config from '$lib/config';
import type { RowDataPacket } from 'mysql2';


export interface ArtworkInfo {
    art_id:           number;
    title:            string;
    tags:             string;
    view_count:       number;
    like_count:       number;
    love_count:       number;
    user_id:          number;
    upload_timestamp: number;
}
export interface ArtworkUri {
    thumb_mini: string;
    small:      string;
    regular:    string;
    original:   string;
}
export interface ArtworkInfoUri extends ArtworkInfo {
    uris: ArtworkUri[];
}


export enum ImageType {
    SFW = 'SFW',
    NSFW = 'NSFW',
    R18 = 'R18',
}
export enum ImageStatus {
    INIT = 0,
    PASS = 1,
    REJECT = 2,
    PUSH = 3,
}

interface ITables {
    audit:           string;
    audit_sfw:       string;
    audit_nsfw:      string;
    audit_r18:       string;
    image_uri:       string;
    character_image: string;
}

const cfg = config.mysql;
const syncPool = mysql.createPool(cfg);
const pool = syncPool.promise();
const tables = {
    audit:      'genshin_pixiv_audit',
    audit_sfw:  'genshin_pixiv_audit_sfw',
    audit_nsfw: 'genshin_pixiv_audit_nsfw',
    audit_r18:  'genshin_pixiv_audit_r18',
    image_uri:  'pixiv_image_uri',
    character_image: 'pixiv_character',
} as ITables;

export async function getImagesByCharacterAndType(name: string,
                                                  imageType: ImageType,
                                                  options?: { page: number }) : Promise<ArtworkInfoUri[]>
{
    const pixivTable = imageTypeToTable(imageType || ImageType.SFW);
    const imageTable = tables.image_uri;
    const characterTable = tables.character_image;
    const pageSize = 20;

    let start = 0;
    if (options && options.page) {
        const page = isNaN(+options.page) ? 0 : Math.floor(options.page - 1);
        start = page * pageSize;
    }
    //    [rows, fields]
    const [rows, _] = await pool.query(
        `
        SELECT gp.art_id,
               gp.title,
               gp.tags,
               gp.view_count,
               gp.like_count,
               gp.love_count,
               gp.user_id,
               gp.upload_timestamp,
               pi.uri_json
        FROM ${imageTable} AS pi
        RIGHT OUTER JOIN (
            SELECT *
            FROM ${characterTable} AS c
                INNER JOIN ${pixivTable} AS gp
                ON c.art_id = gp.illusts_id
            WHERE c.char_name LIKE ? AND (gp.status=? OR gp.status=?)
            ORDER BY gp.upload_timestamp DESC
            LIMIT ? OFFSET ?
        ) AS gp
        ON gp.illusts_id=pi.art_id;
        `,
        [name, ImageStatus.PASS, ImageStatus.PUSH, pageSize, start],
    );
    const r = rows as RowDataPacket[];
    return r.map((row: RowDataPacket) => createArtworkInfoUriFromSQLResponse(row));
}

export async function getImagesByType(imageType: ImageType,
                                      options?: { page: number }) : Promise<ArtworkInfoUri[]>
{
    const pixivTable = imageTypeToTable(imageType || ImageType.SFW);
    const imageTable = tables.image_uri;
    const pageSize = 20;

    let start = 0;
    if (options && options.page) {
        const page = isNaN(+options.page) ? 0 : Math.floor(options.page - 1);
        start = page * pageSize;
    }
    const [rows, _] = await pool.query(
        `
        SELECT gp.illusts_id AS art_id,
               gp.title,
               gp.tags,
               gp.view_count,
               gp.like_count,
               gp.love_count,
               gp.user_id,
               gp.upload_timestamp,
               pi.uri_json
        FROM ${imageTable} AS pi
        RIGHT OUTER JOIN (
            SELECT * 
            FROM ${pixivTable} AS gp
            WHERE (gp.status=? OR gp.status=?)
            ORDER BY gp.upload_timestamp DESC
            LIMIT ? OFFSET ?
        ) AS gp
        ON gp.illusts_id=pi.art_id;
        `,
        [ImageStatus.PASS, ImageStatus.PUSH, pageSize, start],
    );
    const r = rows as RowDataPacket[];
    return r.map((row: RowDataPacket) => createArtworkInfoUriFromSQLResponse(row));
}

export async function saveImageUrisByArtid(art_id: number, uri_json: string) {
    const table = tables.image_uri;
    await pool.query(
        `
        REPLACE INTO ${table} (
            art_id, uri_json
        ) VALUES (
            ?, ?
        );
        `,
        [art_id, uri_json],
    );
}

export async function saveImageUrisByManyArtid(items: Array<{art_id: number, uri_json: string}>) {
    const table = tables.image_uri;
    const data = items.map((a: any) => [a.art_id, a.uri_json]);
    await pool.query(
        `
        REPLACE INTO ${table} (
            art_id, uri_json
        ) VALUES ?;
        `,
        [data],
    );
}

export async function getImageUrisByArtid(artid: number): Promise<ArtworkUri[]> {
    const table = tables.image_uri;
    const [rows, _] = await pool.query(
        `
        SELECT art_id, uri_json
        FROM ${table}
        WHERE art_id=?
        `,
        [artid],
    );
    if ((rows as RowDataPacket[]).length === 0) {
        return [];
    }
    return JSON.parse(rows[0].uri_json);
}

export async function getArtsWithUnknownUri(): Promise<number[]> {
    const pixivTable = tables.audit;
    const imageTable = tables.image_uri;
    const artidList: number[] = [];
    const [rows, _] = await pool.query(
        `
        SELECT illusts_id AS art_id
        FROM ${pixivTable}
        WHERE illusts_id NOT IN (SELECT art_id FROM ${imageTable})
            AND (status=? OR status=?)
		ORDER BY upload_timestamp DESC;
        `,
        [ImageStatus.PASS, ImageStatus.PUSH],
    );
    for (const row of rows as RowDataPacket[]) {
        artidList.push(row.art_id);
    }
    return artidList;
}

export async function saveImageCharactersByManyArtid(items: Array<{art_id: number, names: string[]}>) {
    const characterTable = tables.character_image;
    const data = [];
    if (items.length === 0)
        return;
    for (const info of items) {
        const newData = info.names.map((name: string) => [ info.art_id, name ]);
        data.push(...newData);
    }
    await pool.query(
        `
        REPLACE INTO ${characterTable} (
            art_id, char_name
        ) VALUES ?;
        `,
        [data],
    );
}

export async function getArtsWithUnknownCharacters(): Promise<Array<{art_id: number, tags: string}> > {
    const pixivTable = tables.audit;
    const characterTable = tables.character_image;
    const [rows, _] = await pool.query(
        `
        SELECT illusts_id AS art_id, tags
        FROM ${pixivTable}
        WHERE illusts_id NOT IN (SELECT art_id FROM ${characterTable})
            AND (status=1 OR status=3)
        ORDER BY upload_timestamp DESC;
        `
    );
    const r = rows as RowDataPacket[];
    return r.map((row: RowDataPacket) => ({ art_id: row.art_id as number, tags: row.tags as string }));
}

export async function getArtworkCount(): Promise<number> {
    const pixivTable = tables.audit;
    const [rows, _] = await pool.query(
        `
        SELECT COUNT(illusts_id) AS count
        FROM ${pixivTable}
        WHERE (status=? OR status=?);
        `,
        [ImageStatus.PASS, ImageStatus.PUSH],
    );
    const r = rows as RowDataPacket[];
    return r[0].count as number;
}

/**
 * Latest uploaded time in X days
 */
export async function getLatestUploadedTime(): Promise<number> {
    const pixivTable = tables.audit;
    const [rows, _] = await pool.query(
        `
        SELECT DATEDIFF(NOW(), FROM_UNIXTIME(MAX(upload_timestamp))) AS days_ago
        FROM ${pixivTable};
        `,
        [ImageStatus.PASS, ImageStatus.PUSH],
    );
    const r = rows as RowDataPacket[];
    if (r.length === 0) {
        return -1;
    }
    return r[0].days_ago;
}

export async function getArtworkCountSFW(): Promise<number> {
    const pixivTable = tables.audit_sfw;
    const [rows, _] = await pool.query(
        `
        SELECT COUNT(illusts_id) AS count
        FROM ${pixivTable}
        WHERE (status=? OR status=?);
        `,
        [ImageStatus.PASS, ImageStatus.PUSH],
    );
    const r = rows as RowDataPacket[];
    return r[0].count as number;
}

export async function getArtworkCountNSFW(): Promise<number> {
    const pixivTable = tables.audit_nsfw;
    const [rows, _] = await pool.query(
        `
        SELECT COUNT(illusts_id) AS count
        FROM ${pixivTable}
        WHERE (status=? OR status=?);
        `,
        [ImageStatus.PASS, ImageStatus.PUSH],
    );
    const r = rows as RowDataPacket[];
    return r[0].count as number;
}

export async function getArtworkCountR18(): Promise<number> {
    const pixivTable = tables.audit_r18;
    const [rows, _] = await pool.query(
        `
        SELECT COUNT(illusts_id) AS count
        FROM ${pixivTable}
        WHERE (status=? OR status=?);
        `,
        [ImageStatus.PASS, ImageStatus.PUSH],
    );
    const r = rows as RowDataPacket[];
    return r[0].count as number;
}

function imageTypeToTable(imageType: ImageType): string {
    let typeToTable = {};
    typeToTable[ImageType.SFW] = tables.audit_sfw;
    typeToTable[ImageType.NSFW] = tables.audit_nsfw;
    typeToTable[ImageType.R18] = tables.audit_r18;
    return typeToTable[imageType];
}

function createArtworkInfoUriFromSQLResponse(data: RowDataPacket): ArtworkInfoUri {
    const uris: ArtworkUri[] = data.uri_json ? JSON.parse(data.uri_json) : [];
    return <unknown>{
        ...data,
        uri_json: undefined,
        uris: uris,
    } as ArtworkInfoUri;
}

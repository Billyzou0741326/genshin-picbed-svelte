import { URL } from 'url';
import type { ArtworkUri, ArtworkInfoUri } from '$lib/pixiv/repository';

interface ArtworkUriExtended extends ArtworkUri {
    regular_path:  string;
    original_path: string;
}
export interface ArtworkInfoUriExtended extends ArtworkInfoUri {
    uris: ArtworkUriExtended[];
}

export function transformArtworkPath(artworkInfo: ArtworkInfoUri): ArtworkInfoUriExtended {
    const uris = artworkInfo.uris.map((uri) => {
        return {
            ...uri,
            regular_path: extractPathFromURL(uri.regular),
            original_path: extractPathFromURL(uri.original),
        }
    });
    return {
        ...artworkInfo,
        uris: uris,
    } as ArtworkInfoUriExtended;
}

function extractPathFromURL(url: string): string {
    return (new URL(url)).pathname;
}

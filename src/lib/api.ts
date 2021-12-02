export async function getArtIds({ fetch, imageType, apiBaseUrl }) {
    const paramType = imageType || 'SFW';
    const idEndpoint = `${apiBaseUrl}/api/characters`;
    const searchParams = new URLSearchParams();
    searchParams.set('type', paramType);
    const url = `${idEndpoint}?${searchParams.toString()}`;
    return await getArtIdsWithUrl({ fetch, imageType, url });
}

export async function getArtIdsByCharacter({ fetch, imageType, apiBaseUrl, characterName }) {
    const paramType = imageType || 'SFW';
    const idEndpoint = `${apiBaseUrl}/api/character/${characterName}`;
    const searchParams = new URLSearchParams();
    searchParams.set('type', paramType);
    const url = `${idEndpoint}?${searchParams.toString()}`;
    return await getArtIdsWithUrl({ fetch, imageType, url });
}

async function getArtIdsWithUrl({ fetch, url }) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Cannot load ${url}`);
    }
    const data = await res.json();
    const allIds = data.data;
    return allIds;
}

export async function getArtImageInfo({ fetch, idList, apiBaseUrl }) {
    const imageEndpoint = `${apiBaseUrl}/api/imageInfo`;
    const searchParams = new URLSearchParams();
    for (const id of idList) {
        searchParams.append('ids', id);
    }
    const uri = `${imageEndpoint}?${searchParams.toString()}`;
    const res = await fetch(uri);

    if (!res.ok) {
        throw new Error(`Cannot load ${uri}`);
    }
    const data = await res.json();
    const artList = data.data.filter((a: any) => (a.images.length > 0)).map((a: any) => {
        a.images.map((image: any) => {
            const newImage = { ...image };
            newImage.urls.original_path = getPath(image.urls.original);
            newImage.urls.regular_path = getPath(image.urls.regular);
            newImage.urls.small_path = getPath(image.urls.small);
            return newImage;
        });
        return { ...a };
    });
    return artList;
}

function getPath(url: string): string {
    const u = new URL(url);
    return u.pathname;
}

<script context="module" lang="ts">

    import { browser } from '$app/env';
    import { getArtIdsByCharacter, getArtImageInfo } from '$lib/api';
    import type { ArtworkInfo } from '../api/characters';

    interface PagedArtworkInfo extends ArtworkInfo {
        page: number;
    }

    export const prerender = false;
    export const router = true;

    /**
      * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ url, params, fetch, session }) {
        const path = url.pathname;
        if (browser) {
            console.log(`Load - ${path}: ${params.toString()}`);
        }

        const apiBaseUrl = session.apiBaseUrl || '';
        const imageType = url.searchParams.get('type') || 'SFW';
        const characterName = params.name;
        const allIds = await getArtIdsByCharacter({ fetch, apiBaseUrl, imageType, characterName });
        const idList = allIds.slice(0, 30);
        const artList = await getArtImageInfo({ fetch, apiBaseUrl, idList });
        const newData = artList.map((a: any) => ({
            ...a,
            page: 1,
        }));
        return {
            props: {
                apiBaseUrl: session.apiBaseUrl || '',
                imageBaseUrl: session.imageBaseUrl || '',
                charName: characterName,
                allIds: allIds,
                newData: newData,
            },
        };
    }

    function dedupe(newData: PagedArtworkInfo[], artworkInfoList: PagedArtworkInfo[]) {
        const tmp = new Set();
        for (const art of artworkInfoList) {
            tmp.add(art.art_id);
        }
        return newData.filter((a) => !tmp.has(a.art_id));
    }

    function merge(newData: PagedArtworkInfo[], artworkInfoList: PagedArtworkInfo[]) {
        return [
            ...artworkInfoList,
            ...dedupe(newData, artworkInfoList),
        ];
    }

    function prefilter(artworkInfoList, thresholds) {
        return artworkInfoList
            .filter((artworkInfo) => (
                artworkInfo.images[0]?.nsfw?.hentai < thresholds.nsfw
                    || artworkInfo.images[0]?.nsfw?.hentai === undefined
            ))
            .filter((artworkInfo) => (
                artworkInfo.sl <= thresholds.sl
            ));
    }
</script>

<script lang="ts">
    import InfiniteScroll from '$lib/InfiniteScroll.svelte';
    import ImageCard from '$lib/ImageCard.svelte';
    import capitalize from 'lodash/capitalize.js';
    import { sl_threshold, nsfw_threshold } from '$lib/stores/nsfw';
    import type { ArtworkInfo } from '../api/characters';

    interface PagedArtworkInfoUri extends ArtworkInfo {
        page: number;
    }

    export let apiBaseUrl: string = '';
    export let imageBaseUrl: string = '';
    export let newData: PagedArtworkInfoUri[] = [];
    export let charName: string = '';
    export let allIds: number[] = [];
    let artworkInfoList: PagedArtworkInfoUri[] = [];
    let filteredList: PagedArtworkInfoUri[] = [];
    let page = 2;
    let imageType = null;
    let fetching: boolean = false;

    $: {
        artworkInfoList = merge(newData, artworkInfoList);
        filteredList = prefilter(artworkInfoList, { sl: $sl_threshold, nsfw: $nsfw_threshold });
        //console.log((arr => arr.filter((item, index) => arr.indexOf(item) !== index))(artworkInfoList.map(a => a.art_id)));
    }

    async function fetchData(pg: number) {
        if (fetching) {
            return;
        }
        fetching = true;
        try {
            const lastId = newData.length > 0 ? newData[newData.length-1].art_id : 0;
            const i = allIds.indexOf(lastId);
            const index = i >= 0 ? i+1 : 0;
            //console.log(index);
            const searchParams = new URLSearchParams();
            const idList = allIds.slice(index, index + 20);
            const artList = await getArtImageInfo({ fetch, apiBaseUrl, idList });

            //console.log(`fetching page ${pg}...`);
            newData = artList.map((a: any) => ({ ...a, page: pg }));
        } finally {
            fetching = false;
        }
    }
</script>

<svelte:head>
    <title>{capitalize(charName)} - Genshin Picbed</title>
</svelte:head>

<div class="p-4 lg:py-8">
    <div class="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md lg:hidden">
        <span class="font-semibold antialiased text-lg text-black dark:text-gray-100 uppercase tracking-wider">{charName}</span>
    </div>

    <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5
                    gap-2 lg:gap-8 mt-4 lg:mt-0 mb-20 justify-items-center"
    >
        {#each filteredList as artworkInfo (artworkInfo.art_id)}
            <ImageCard artwork={artworkInfo} imageBaseUrl={imageBaseUrl} />
        {/each}
    </section>
    <InfiniteScroll hasMore={newData && newData.length > 0}
                    threshold={250}
                    window={true}
                    on:more={() => {
                        fetchData(page);
                        page++;
                    }} />
    {#if newData && newData.length > 0}
        <div class="flex justify-center items-center w-full">
            <div
                class="animate-spin rounded-full
                       h-32 w-32
                       border-t-2 border-b-2 border-purple-500
                "
            ></div>
        </div>
    {/if}
</div>


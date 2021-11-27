<script context="module" lang="ts">

    import { browser } from '$app/env';

    export const prerender = false;

    /**
      * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ page, fetch, session }) {
        if (browser) {
            console.log(`Load - ${page.path}: ${page.query.toString()}`);
        }

        const charName = page.params.name;
        let res = await (async() => {
            const paramType = page.query.get('type') || 'SFW';
            const idEndpoint = `${session.apiBaseUrl}/api/character/${charName}`;
            const searchParams = new URLSearchParams();
            searchParams.set('type', paramType);
            const uri = `${idEndpoint}?${searchParams.toString()}`;
            return await fetch(uri);
        })();

        if (!res.ok) {
            return {
                status: res.status,
                error: new Error(`Cannot load ${session.apiBaseUrl}/api/character/${charName}`),
            };
        }
        let data = await res.json();
        const allIds = data.data;

        res = await (async() => {
            const imageEndpoint = `${session.apiBaseUrl}/api/imageInfo`;
            const searchParams = new URLSearchParams();
            for (const id of allIds.slice(0, 20)) {
                searchParams.append('ids', id);
            }
            const uri = `${imageEndpoint}?${searchParams.toString()}`;
            return await fetch(uri);
        })();

        if (!res.ok) {
            return {
                status: res.status,
                error: new Error(`Cannot load ${session.apiBaseUrl}/api/imageInfo`),
            };
        }
        data = await res.json();
        const artList = data.data.filter((a: any) => (a.images.length > 0)).map((a: any) => {
            a.images.map((image: any) => {
                const newImage = { ...image };
                newImage.urls.original_path = getPath(image.urls.original);
                newImage.urls.regular_path = getPath(image.urls.regular);
                return newImage;
            });
            return { ...a };
        });
        const newData = artList.map((a: any) => ({
            ...a,
            page: 1,
        }));
        return {
            props: {
                apiBaseUrl: session.apiBaseUrl,
                imageBaseUrl: session.imageBaseUrl,
                allIds: allIds,
                newData: newData,
            },
        };
    }

    function getPath(url: string): string {
        const u = new URL(url);
        return u.pathname;
    }
</script>

<script lang="ts">
    import InfiniteScroll from '$lib/InfiniteScroll.svelte';
    import ScrollToTopButton from '$lib/ScrollToTopButton.svelte';
    import ImageCard from '$lib/ImageCard.svelte';
    import capitalize from 'lodash/capitalize.js';
    import { nsfw_threshold } from '$lib/stores/nsfw';
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
    let y: number = 0;

    $: {
        artworkInfoList = [
            ...artworkInfoList,
            ...newData,
        ];
        filteredList = artworkInfoList.filter((artworkInfo) => (
            artworkInfo.images[0]?.nsfw?.hentai < $nsfw_threshold || artworkInfo.images[0]?.nsfw?.hentai === undefined
        ));
    }

    async function fetchData(pg: number) {
        console.log(`fetching page ${pg}...`);
        const paramType = imageType || 'SFW';
        const imageEndpoint = `${apiBaseUrl}/api/imageInfo`;
        const lastId = artworkInfoList.length > 0 ? artworkInfoList[artworkInfoList.length-1].art_id : 0;
        const i = allIds.indexOf(lastId);
        const index = i >= 0 ? i+1 : 0;
        //console.log(index);
        const searchParams = new URLSearchParams();
        const ids = allIds.slice(index, index + 20);
        for (const id of ids) {
            searchParams.append('ids', id);
        }
        const uri = `${imageEndpoint}?${searchParams.toString()}`;
        const res = await fetch(uri);

        if (!res.ok) {
            console.log(new Error(`Cannot load ${uri} - ${res.status}`));
            return;
        }
        const data = await res.json();
        const artList = data.data.filter((a: any) => (a.images.length > 0)).map((a: any) => {
            a.images.map((image: any) => {
                const newImage = { ...image };
                newImage.urls.original_path = getPath(image.urls.original);
                newImage.urls.regular_path = getPath(image.urls.regular);
                return newImage;
            });
            return { ...a };
        });
        newData = artList.map((a: any) => ({ ...a, page: pg }));
    }

    function scrollToTop() {
        if (window && window.scrollTo) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            y = 0;
        }
    }
</script>

<svelte:head>
    <title>{capitalize(charName)} - Genshin Picbed</title>
</svelte:head>

<svelte:window bind:scrollY={y} />
<div class="p-4 lg:p-8">
    <div class="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md lg:hidden">
        <span class="font-semibold antialiased text-lg text-black dark:text-gray-100 uppercase tracking-wider">{charName}</span>
    </div>

    <div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-y-5 mt-4 justify-items-center">
        {#each filteredList as artworkInfo (artworkInfo.art_id)}
            <ImageCard artwork={artworkInfo} imageBaseUrl={imageBaseUrl} />
        {/each}
        <InfiniteScroll hasMore={newData.length > 0}
                        threshold={100}
                        window={true}
                        on:more={() => {
                            fetchData(page);
                            page++;
                        }} />
    </div>

    <!-- Scroll to Top -->
    <!-- **DO NOT use if-directive on scroll button. Will break navigation -->
    <ScrollToTopButton class={"fixed rounded-full shadow-lg bg-blue-200 dark:text-gray-100 dark:bg-blue-800 bottom-2 lg:bottom-4 right-2 p-4 " +
                              "hover:bg-blue-500 dark:hover:bg-blue-500 transition ease-in-out" + (y > 1024 ? " block" : " hidden")}
                       on:click={scrollToTop} />
</div>


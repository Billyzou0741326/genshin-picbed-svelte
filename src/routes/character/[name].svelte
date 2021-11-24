<script context="module" lang="ts">

    import { browser } from '$app/env';

    export const prerender = false;

    /**
      * @type {import('@sveltejs/kit').Load}
     */
    export async function load({ page, fetch, session }) {
        if (page.path.startsWith('/pixiv/')) {
            return;
        }
        if (page.path.startsWith('/api/')) {
            return;
        }

        if (browser) {
            console.log(`Load - ${page.path}: ${page.query.toString()}`);
        }

        const charName = page.params.name;
        const paramPage = page.query.get('page') || '1';
        const paramType = page.query.get('type') || 'SFW';
        const endpoint = `${session.apiBaseUrl}/api/character/${charName}`;
        const searchParams = new URLSearchParams();
        searchParams.set('page', paramPage);
        searchParams.set('type', paramType);
        const uri = `${endpoint}?${searchParams.toString()}`;
        const res = await fetch(uri);

        if (res.ok) {
            const data = await res.json();
            const artworkInfoList = data.data.filter((a: any) => (a.uris.length > 0));
            const newData = artworkInfoList.map((a: any) => ({ ...a, page: 1 }));
            return {
                props: {
                    apiBaseUrl: session.apiBaseUrl,
                    imageBaseUrl: session.imageBaseUrl,
                    newData: newData,
                    charName: charName,
                },
            };
        }
        return {
            status: res.status,
            error: new Error(`Cannot load ${uri}`),
        };
    }
</script>

<script lang="ts">
    import InfiniteScroll from '$lib/InfiniteScroll.svelte';
    import ScrollToTopButton from '$lib/ScrollToTopButton.svelte';
    import ImageCard from '$lib/ImageCard.svelte';
    import capitalize from 'lodash/capitalize.js';
    import type { ArtworkInfoUri } from '../api/characters';

    interface PagedArtworkInfoUri extends ArtworkInfoUri {
        page: number;
    }

    export let apiBaseUrl: string = '';
    export let imageBaseUrl: string = '';
    export let newData: PagedArtworkInfoUri[] = [];
    export let charName: string = '';
    let artworkInfoList: PagedArtworkInfoUri[] = [];
    let page = 2;
    let imageType = null;
    let y: number = 0;

    $: {
        artworkInfoList = [
            ...artworkInfoList,
            ...newData,
        ];
    }

    async function fetchData(pg: number) {
        console.log(`fetching page ${pg}...`);
        const paramPage = `${pg}`;
        const paramType = imageType || 'SFW';
        const endpoint = `${apiBaseUrl}/api/character/${charName}`;
        const searchParams = new URLSearchParams();
        searchParams.set('page', paramPage);
        searchParams.set('type', paramType);
        const uri = `${endpoint}?${searchParams.toString()}`;
        const res = await fetch(uri);

        if (res.ok) {
            const data = await res.json();
            const artworkInfoList = data.data.filter((a: any) => (a.uris.length > 0));
            newData = artworkInfoList.map((a: any) => ({ ...a, page: pg }));
            return;
        }
        console.log(new Error(`Cannot load ${uri} - ${res.status}`));
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
        {#each artworkInfoList as artworkInfo (artworkInfo.art_id)}
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
    <ScrollToTopButton class={"fixed rounded-full shadow-lg bg-white dark:text-gray-100 dark:bg-gray-800 bottom-2 lg:bottom-4 right-2 p-4 " +
                              "hover:bg-blue-500 transition ease-in-out" + (y > 1024 ? " block" : " hidden")}
                       on:click={scrollToTop} />
</div>


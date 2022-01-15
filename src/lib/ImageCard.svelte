<script lang="ts">
    import Image from '$lib/Image.svelte';
    import CopyToClipboard from '$lib/CopyToClipboard.svelte';
    import type { ArtworkInfo } from './api/characters';

    interface PagedArtworkInfo extends ArtworkInfo {
        page: number;
    }

    export let imageBaseUrl: string;
    export let artwork: PagedArtworkInfoUri;

    function nsfwPercentage(artwork) {
        const value = artwork.images[0]?.nsfw?.hentai ? artwork.images[0].nsfw.hentai : 0;
        return value * 100;
    }

    function slValue(artwork) {
        return artwork?.sl || 0;
    }
</script>

<div class="relative w-full h-full rounded-2xl shadow-md lg:hover:shadow-2xl transition duration-300 ease-in-out">
    <!--Image-->
    <div class="relative aspect-w-12 aspect-h-16">
        <a target="_blank" href="{imageBaseUrl}{artwork.images[0].urls.original_path}">
            <!-- **DO NOT use percentage width (i.e w-4/5) other than w-full -->
            <Image src="{imageBaseUrl}{artwork.images[0].urls.small_path}"
                   alt="{artwork.title}"
                   blurLazyLoad={artwork.page !== 1}
                   class="w-full h-full rounded-t-2xl object-cover"
            />
        </a>
    </div>
    <button class="absolute top-0 right-0 flex flex-row items-center px-1 bg-white bg-opacity-75 rounded-lg shadow">
        <span class="mr-1">{artwork.images.length}</span>
        <!--Heroicon collection-->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /> </svg>
    </button>
    <!--Metadata-->
    <div class="rounded-b-2xl p-2 bg-white dark:bg-gray-800 text-md flex flex-col">
        <!--Pixiv id-->
        <div class="px-2 py-1 flex flex-row gap-2 items-center text-gray-500">
            <span>{artwork.art_id}</span>
            <CopyToClipboard class="transition ease-in-out hover:text-blue-500 outline-none"
                             value="{artwork.art_id.toString()}">
                <!--Heroicon clipboard-copy-->
                <svg xmlns="http://www.w3.org/2000/svg" slot="icon" class="h-4 w-4" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                </svg>
            </CopyToClipboard>
        </div>
        <!--Pixiv link-->
        <a target="_blank"
           href="https://www.pixiv.net/artworks/{artwork.art_id}"
           rel="noopener noreferrer"
           class="px-2 py-1 flex flex-row gap-2 items-center text-green-500 hover:text-green-700">
            <span>Pixiv</span>
            <!--Heroicon external-link-->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /> </svg>
        </a>
        <!--SL Bar-->
        <div class="px-2 py-1 relative">
            <div class="flex mb-2 items-center justify-between">
                <div>
                    <span class="text-xs font-semibold uppercase
                                 text-blue-600 bg-blue-200 inline-block
                                 py-1 px-2 rounded-full
                    ">
                        SL
                    </span>
                </div>
                <div class="text-right">
                    <span class="text-xs font-semibold inline-block text-blue-600">
                        {slValue(artwork)}
                    </span>
                </div>
            </div>
            {#if slValue(artwork) <= 2}
            <div class="overflow-hidden h-2 text-xs flex rounded bg-green-100">
                <div
                    style="width: 0%"
                    class="shadow-none flex flex-col text-center
                           whitespace-nowrap text-white
                           justify-center bg-green-500
                    "
                ></div>
            </div>
            {:else if slValue(artwork) <= 4}
            <div class="overflow-hidden h-2 text-xs flex rounded bg-yellow-100">
                <div
                    style="width: 50%"
                    class="shadow-none flex flex-col text-center
                           whitespace-nowrap text-white
                           justify-center bg-yellow-500
                    "
                ></div>
            </div>
            {:else}
            <div class="overflow-hidden h-2 text-xs flex rounded bg-red-100">
                <div
                    style="width: 100%"
                    class="shadow-none flex flex-col text-center
                           whitespace-nowrap text-white
                           justify-center bg-red-500
                    "
                ></div>
            </div>
            {/if}
        </div>
        <!--NSFW Bar-->
        <div class="px-2 py-1 relative">
            <div class="flex mb-2 items-center justify-between">
                <div>
                    <span class="text-xs font-semibold uppercase
                                 text-blue-600 bg-blue-200 inline-block
                                 py-1 px-2 rounded-full
                    ">
                        NSFW
                    </span>
                </div>
                <div class="text-right">
                    <span class="text-xs font-semibold inline-block text-blue-600">
                        {nsfwPercentage(artwork).toFixed(2)}%
                    </span>
                </div>
            </div>
            {#if nsfwPercentage(artwork) < 33}
            <div class="overflow-hidden h-2 text-xs flex rounded bg-green-100">
                <div
                    style="width: {nsfwPercentage(artwork)}%"
                    class="shadow-none flex flex-col text-center
                           whitespace-nowrap text-white
                           justify-center bg-green-500
                    "
                ></div>
            </div>
            {:else if nsfwPercentage(artwork) < 66}
            <div class="overflow-hidden h-2 text-xs flex rounded bg-yellow-100">
                <div
                    style="width: {nsfwPercentage(artwork)}%"
                    class="shadow-none flex flex-col text-center
                           whitespace-nowrap text-white
                           justify-center bg-yellow-500
                    "
                ></div>
            </div>
            {:else}
            <div class="overflow-hidden h-2 text-xs flex rounded bg-red-100">
                <div
                    style="width: {nsfwPercentage(artwork)}%"
                    class="shadow-none flex flex-col text-center
                           whitespace-nowrap text-white
                           justify-center bg-red-500
                    "
                ></div>
            </div>
            {/if}
        </div>
    </div>
</div>

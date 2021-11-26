<script lang="ts">
    import Image from '$lib/Image.svelte';
    import CopyToClipboard from '$lib/CopyToClipboard.svelte';
    import type { ArtworkInfo } from './api/characters';

    interface PagedArtworkInfo extends ArtworkInfo {
        page: number;
    }

    export let imageBaseUrl: string;
    export let artwork: PagedArtworkInfoUri;
</script>

<div class="relative rounded-2xl shadow-md lg:hover:shadow-2xl transition duration-300 ease-in-out">
    <!--Image-->
    <a target="_blank" href="{imageBaseUrl}{artwork.images[0].urls.original_path}">
        <Image src="{imageBaseUrl}{artwork.images[0].urls.regular_path}"
               alt="{artwork.title}"
               blurLazyLoad={artwork.page !== 1}
               class="rounded-t-2xl h-64 w-56 md:h-64 md:w-60 lg:h-52 lg:w-48 object-cover" />
    </a>
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
            <CopyToClipboard class="transition ease-in-out hover:text-blue-500" value="{artwork.art_id.toString()}">
                <!--Heroicon clipboard-copy-->
                <svg xmlns="http://www.w3.org/2000/svg" slot="icon" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /> </svg>
            </CopyToClipboard>
        </div>
        <!--Pixiv link-->
        <a target="_blank"
           href="https://www.pixiv.net/artworks/{artwork.art_id}"
           rel="noopener noreferrer"
           class="px-2 py-1 flex flex-row gap-2 items-center text-green-500 hover:text-green-700"
        >
            <span>Pixiv</span>
            <!--Heroicon external-link-->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /> </svg>
        </a>
        <!--Action row-->
        <div class="px-2 py-1 flex flex-row gap-2 items-center">
            <!--Heroicon trash-->
            <button class="text-red-500 hover:text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            </button>
            <!--Heroicon heart-->
            <button class="text-green-500 hover:text-green-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            </button>
        </div>
    </div>
</div>

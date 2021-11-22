<script lang="ts">
    import Image from '$lib/Image.svelte';
    import CopyToClipboard from '$lib/CopyToClipboard.svelte';
    import type { ArtworkInfoUriExtended } from '$lib/pixiv/service';

    interface PagedArtworkInfoUri extends ArtworkInfoUriExtended {
        page: number;
    }

    export let imageBaseUrl: string;
    export let artwork: PagedArtworkInfoUri;
</script>

<div class="relative rounded-2xl shadow-md lg:hover:shadow-2xl transition duration-300 ease-in-out">
    <!--Image-->
    <a target="_blank" href="{imageBaseUrl}{artwork.uris[0].original_path}">
        <Image src="{imageBaseUrl}{artwork.uris[0].regular_path}"
               alt="{artwork.title}"
               blurLazyLoad={artwork.page !== 1}
               class="rounded-t-2xl h-64 w-56 md:h-64 md:w-60 lg:h-52 lg:w-48 object-cover" />
    </a>
    <button class="absolute top-0 right-0 flex flex-row items-center px-1 bg-white bg-opacity-75 rounded-lg shadow">
        <span class="mr-1">{artwork.uris.length}</span>
        <!--Heroicon collection-->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /> </svg>
    </button>
    <!--Metadata-->
    <div class="rounded-b-2xl p-2 bg-white dark:bg-gray-800 text-sm flex flex-col">
        <!--Pixiv id-->
        <div class="px-2 py-1 text-gray-500 flex flex-row items-center">
            <span class="mr-2">{artwork.art_id}</span>
            <CopyToClipboard class="transition ease-in-out hover:text-blue-500" value="{artwork.art_id.toString()}">
                <!--Heroicon clipboard-copy-->
                <svg xmlns="http://www.w3.org/2000/svg" slot="icon" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /> </svg>
            </CopyToClipboard>
        </div>
        <!--Pixiv link-->
        <a target="_blank"
           href="https://www.pixiv.net/artworks/{artwork.art_id}"
           rel="noopener noreferrer"
           class="px-2 py-1 flex flex-row items-center"
        >
            <span class="mr-2">Pixiv</span>
            <!--Heroicon external-link-->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /> </svg>
        </a>
    </div>
</div>

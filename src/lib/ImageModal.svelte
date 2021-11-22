<script lang="ts">
    /** !!! Remove this file !!! */
    import Image from '$lib/Image.svelte';
    import { createEventDispatcher, onMount, onDestroy } from 'svelte';
    import type { ArtworkInfoUriExtended } from '$lib/pixiv/service';

    interface PagedArtworkInfoUri extends ArtworkInfoUriExtended {
        page: number;
    }

    export let imageBaseUrl: string;
    export let artwork: PagedArtworkInfoUri;
    export let open: boolean = false;
    let modalElem: HTMLElement | null = null;
    let page: number = 1;
    const dispatch = createEventDispatcher();

    function emitClose() {
        dispatch('close');
    }

    function handleClickAway(event: Event) {
        if (modalElem && !modalElem.contains(event.target as Node) && !event.defaultPrevented) {
            emitClose();
        }
    }

    function nextPage() {
        if (page < artwork.uris.length) {
            page++;
        }
    }

    function previousPage() {
        if (page > 1) {
            page--;
        }
    }

    onMount(() => {
        document.addEventListener('click', handleClickAway, true);
    });

    onDestroy(() => {
        document.removeEventListener('click', handleClickAway, true);
    });
</script>

{#if (open)}
<div class="fixed z-20 overflow-y-scroll overscroll-contain top-0 left-0 h-screen w-screen block">
<div class="fixed z-30 mx-auto my-auto sm:w-3/4 md:w-2/4 inset-0 flex items-center">
    <!--Modal container-->
    <div bind:this={modalElem} class="bg-white rounded-lg shadow p-4 w-full flex flex-col">
        <!--Modal header-->
        <header class="flex flex-row text-gray-500">
            <h2 class="flex-grow">{artwork.title}</h2>
            <!--Heroicon x-circle-->
            <button on:click={emitClose}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /> </svg>
            </button>
        </header>
        <div class="border-t" />
        <!--Modal body-->
        <section class="flex flex-row justify-center items-center">
            {#each artwork.uris as uri, i (uri.original_path)}
                <Image src="{imageBaseUrl}{uri.original_path}"
                       alt={artwork.title}
                       class={"max-h-96" + (i === page-1 ? ' ' : ' hidden')} />
            {/each}
        </section>
        <section class="flex flex-row justify-center items-center">
            <!-- Heroicon chevron-double-left -->
            {#if (page > 1)}
            <button class="transition ease-in-out" on:click={previousPage}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /> </svg>
            </button>
            {/if}
            <span>{page} / {artwork.uris.length}</span>
            <!-- Heroicon chevron-double-right -->
            {#if (page < artwork.uris.length)}
            <button class="transition ease-in-out" on:click={nextPage}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /> </svg>
            </button>
            {/if}
        </section>
    </div>
</div>
</div>
{/if}

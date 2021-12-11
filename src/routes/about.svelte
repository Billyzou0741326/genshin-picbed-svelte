<script context="module" lang="ts">
    import { browser } from '$app/env';

	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
    export const router = browser;

    export const prerender = false;
</script>

<svelte:head>
    <title>About - Genshin Picbed</title>
</svelte:head>

<div class="pt-16 px-4 mb-0 lg:px-16 md:pt-8">
    <header>
        <h1 class="mt-4 text-center text-3xl">About this site</h1>
    </header>

	<p class="mt-4">
        Our site maintains a wealth of artworks of various
        <a href="https://genshin.mihoyo.com/" rel="noopener noreferrer external" target="_blank">Genshin Impact</a>
        characters.
        We collect and filter genshin related arts from 
        <a href="https://www.pixiv.net/" rel="noopener noreferrer external" target="_blank">Pixiv</a>, an online community for artists to share their work.
	</p>

	<p class="mt-4">
        Join our <a href="https://t.me/GenShinPicBed" rel="noopener noreferrer external" target="_blank">Telegram channel</a>
        to receive the latest updates on new high quality images.
	</p>

    <p class="mt-4">
        <span>*Disclaimer: we DO NOT own any of these artworks. If you don't want your work included on our site, contact us so we can remove them from this site.</span>
    </p>

    <p class="mt-4">
        If you found any problems with this site, 
        <a href="https://github.com/Billyzou0741326/genshin-picbed-svelte/issues">open an issue</a>
        on Github. Any form of contribution is welcome and appreciated.
    </p>
</div>

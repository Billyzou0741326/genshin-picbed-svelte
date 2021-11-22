<script context="module">
	import { browser, dev } from '$app/env';

	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	export const hydrate = dev;

	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	export const router = browser;

	// since there's no dynamic data here, we can prerender
	// it so that it gets served as a static asset in prod
	export const prerender = true;
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
        <a href="https://genshin.mihoyo.com/" rel="noopener noreferrer" target="_blank">Genshin Impact</a>
        characters.
        We collect and filter genshin related arts from 
        <a href="https://www.pixiv.net/" rel="noopener noreferrer" target="_blank">Pixiv</a>, an online community for artists to share their work.
        The process of collecting the artworks is largely automated,
        except for the last step before resharing these arts where we
        go through the images one at a time, <span class="font-bold">handpick</span>
        the ones to present in order to ensure quality.
	</p>

	<p class="mt-4">
        Join our <a href="https://t.me/GenShinPicBed" rel="noopener noreferrer" target="_blank">Telegram channel</a>
        to regularly receive updates on new high quality images!
	</p>

    <p class="mt-4">
        <span>*Disclaimer: we DO NOT own any of these artworks. If you don't want your work included on our site, contact us and we'll take them down at once.</span>
    </p>

    <p class="mt-4">
        If you found any problems with this site, 
        <a href="https://github.com/Billyzou0741326/genshin-picbed-web/issues">open an issue</a>
        on Github. Any form of contribution is welcome and appreciated.
    </p>
</div>

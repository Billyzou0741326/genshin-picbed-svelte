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

        const uri = `${session.apiBaseUrl}/api/statistics`;
        const res = await fetch(uri);

        if (res.ok) {
            const data = await res.json();
            const artworkData = data.data.artwork;
            return {
                props: {
                    artworkTotal: artworkData.total,
                    artworkSFW: artworkData.sfw,
                    artworkNSFW: artworkData.nsfw,
                    artworkR18: artworkData.r18,
                    latestUploadDays: artworkData.latestUploadDays,
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
    export let artworkTotal: number;
    export let artworkSFW: number;
    export let artworkNSFW: number;
    export let artworkR18: number;
    export let latestUploadDays: number;
</script>


<svelte:head>
    <title>Statistics - Genshin Picbed</title>
</svelte:head>

<section class="p-4 lg:p-8">
    <header>
        <h1 class="py-4 text-3xl">Stats</h1>
    </header>

    <div class="grid gap-8 md:grid-cols-2">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <dl class="space-y-2">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-200">Total</dt>
                <dt>
                    <span class="text-5xl dark:text-white font-light md:text-6xl">{artworkTotal}</span>
                    <span class="text-md text-gray-500 dark:text-gray-200">artworks</span>
                </dt>
            </dl>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <dl class="space-y-2">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-200">Lastest upload in</dt>
                <dt>
                    {#if latestUploadDays < 3}
                    <span class="text-5xl text-green-500 font-light md:text-6xl">{latestUploadDays}</span>
                    {:else if latestUploadDays < 30}
                    <span class="text-5xl text-yellow-500 font-light md:text-6xl">{latestUploadDays}</span>
                    {:else}
                    <span class="text-5xl text-red-500 font-light md:text-6xl">{latestUploadDays}</span>
                    {/if}
                    <span class="text-md text-gray-500 dark:text-gray-200">{latestUploadDays === 1 ? "day" : "days"}</span>

                </dt>
            </dl>
        </div>
    </div>
    <div class="grid gap-6 md:grid-cols-3 mt-6">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <dl class="space-y-2">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-200">SFW</dt>
                <dt>
                    <span class="text-4xl text-green-500 font-light md:text-6xl">{artworkSFW}</span>
                    <span class="text-md text-gray-500 dark:text-gray-200">artworks</span>
                </dt>
            </dl>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <dl class="space-y-2">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-200">NSFW</dt>
                <dt>
                    <span class="text-4xl dark:text-white font-light md:text-6xl">{artworkNSFW}</span>
                    <span class="text-md text-gray-500 dark:text-gray-200">artworks</span>
                </dt>
            </dl>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <dl class="space-y-2">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-200">R18</dt>
                <dt>
                    <span class="text-4xl dark:text-white font-light md:text-6xl">{artworkR18}</span>
                    <span class="text-md text-gray-500 dark:text-gray-200">artworks</span>
                </dt>
            </dl>
        </div>
    </div>
</section>

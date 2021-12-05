<script context="module" lang="ts">
    export const prerender = false;
    export function load({ fetch, session }) {
        return {
            props: {
                api_key:   session.google.apiKey,
                client_id: session.google.clientId,
            },
        };
    }
</script>

<script lang="ts">
    import '$lib/tailwind.css';
    import { onMount, onDestroy } from 'svelte';
    import { darkmode } from '$lib/stores/appearance';
    import { sl_threshold, nsfw_threshold } from '$lib/stores/nsfw';
    import { fade } from 'svelte/transition';
    import Sidebar from '$lib/sidebar/Sidebar.svelte';
    import DataSync from '$lib/DataSync.svelte';
    import FloatingAction from '$lib/FloatingAction.svelte';

    export let api_key = '';
    export let client_id = '';

    let onDestroyCallbacks = [];

    onMount(() => {
        const mode = localStorage.getItem('darkmode');
        const nsfwThreshold = Number(localStorage.getItem('nsfw_threshold') || '.');
        const slThreshold = Number(localStorage.getItem('sl_threshold') || '.');
        if (mode === 'true') {
            darkmode.set(true);
        }
        if (!isNaN(nsfwThreshold) && nsfwThreshold >= 0 && nsfwThreshold <= 1) {
            nsfw_threshold.set(nsfwThreshold);
        }
        if (!isNaN(slThreshold) && slThreshold >= 0 && slThreshold <= 6) {
            sl_threshold.set(slThreshold);
        }
        onDestroyCallbacks.push(darkmode.subscribe((val) => {
            localStorage.setItem('darkmode', val ? 'true' : 'false');
        }));
        onDestroyCallbacks.push(nsfw_threshold.subscribe((val) => {
            localStorage.setItem('nsfw_threshold', `${val}`);
        }));
        onDestroyCallbacks.push(sl_threshold.subscribe((val) => {
            localStorage.setItem('sl_threshold', `${val}`);
        }));
    });

    onDestroy(() => {
        for (const cb of onDestroyCallbacks) {
            cb && cb();
        }
    });
</script>

<div class="{$darkmode ? 'dark' : ''}">
    <Sidebar />
    <div class="w-full min-h-screen dark:bg-black">
        <main class="pt-0 lg:ml-64" in:fade="{{ duration: 500 }}">
            <slot />
        </main>
        <footer class="flex flex-col justify-center items-center p-10 lg:px-0 lg:ml-64">
            <p>
                © 2021 Genshin Picbed
            </p>
        </footer>
    </div>
    <DataSync clientId={client_id} apiKey={api_key} />
</div>

<style>
    main {
        flex: 1 0 auto;
    }
</style>

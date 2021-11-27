<script context="module" lang="ts">

    export async function load({ fetch, session }) {
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
    import { nsfw_threshold } from '$lib/stores/nsfw';
    import Sidebar from '$lib/sidebar/Sidebar.svelte';
    import DataSync from '$lib/DataSync.svelte';

    export let api_key = '';
    export let client_id = '';

    let onDestroyCallbacks = [];

    onMount(() => {
        const mode = localStorage.getItem('darkmode');
        const threshold = Number(localStorage.getItem('threshold') || '.');
        if (mode === 'true') {
            darkmode.set(true);
        }
        if (!isNaN(threshold) && threshold >= 0 && threshold <= 1) {
            nsfw_threshold.set(threshold);
        }
        onDestroyCallbacks.push(darkmode.subscribe((val) => {
            localStorage.setItem('darkmode', val ? 'true' : 'false');
        }));
        onDestroyCallbacks.push(nsfw_threshold.subscribe((val) => {
            localStorage.setItem('threshold', `${val}`);
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
    <div class="m-0 p-0 w-full min-h-screen dark:bg-black">
        <main class="pt-0 lg:ml-64">
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

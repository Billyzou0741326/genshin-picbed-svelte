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
    import Sidebar from '$lib/sidebar/Sidebar.svelte';
    import DataSync from '$lib/DataSync.svelte';

    export let api_key = '';
    export let client_id = '';

    let unsubscribe;

    onMount(() => {
        const mode = localStorage.getItem('darkmode');
        if (mode === 'true') {
            darkmode.set(true);
        }
        unsubscribe = darkmode.subscribe((val) => {
            localStorage.setItem('darkmode', val ? 'true' : 'false');
        });
    });

    onDestroy(() => {
        unsubscribe && unsubscribe();
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

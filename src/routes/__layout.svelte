<script lang="ts">
    import '$lib/tailwind.css';
    import { darkmode } from '$lib/stores/appearance';
    import Sidebar from '$lib/sidebar/Sidebar.svelte';
</script>

<div class="{$darkmode ? 'dark' : ''}">
    <Sidebar />
    <div class="m-0 p-0 w-full min-h-screen dark:bg-black">
        <main class="pt-20 md:pt-0 lg:ml-64">
            <slot />
        </main>
        <footer class="flex flex-col justify-center items-center p-10 lg:px-0 lg:ml-64">
            <p>
                © 2021 Genshin Picbed
            </p>
        </footer>
    </div>
</div>

<style>
    main {
        flex: 1 0 auto;
    }
</style>

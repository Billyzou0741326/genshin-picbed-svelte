<script lang="ts">
    import { darkmode } from '$lib/stores/appearance';

    function toggleDarkmode() {
        darkmode.update(value => !value);
    }
</script>

<svelte:head>
	<title>Settings - Genshin Picbed</title>
</svelte:head>

<section class="p-4 lg:p-8">
    <header class="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md lg:hidden">
        <span class="font-semibold antialiased text-lg text-black dark:text-gray-100">Settings</span>
    </header>

    <section class="flex flex-col gap-y-6 mt-4 lg:mt-0">
        <div class="grid md:grid-cols-settings-sidebar gap-y-4">
            <div>
                <h2 class="font-semibold">Appearance</h2>
                <div class="mt-2 border-t md:border-0 dark:border-gray-500" />
            </div>
            <div class="flex flex-col mt-2 md:mt-1">
                <div>
                    <span class="dark:text-gray-100">Choose how the site looks to you by selecting a theme.</span>
                </div>
                <div class="flex flex-row mt-4 items-center justify-start w-full dark:text-gray-100">
                    <label for="darkmode"
                           class="flex items-center cursor-pointer"
                    >
                        <!--heroicon sun-->
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /> </svg>
                        <!-- toggle -->
                        <div class="relative mx-2">
                            <!-- input -->
                            <input id="darkmode" type="checkbox" checked={$darkmode} on:change={toggleDarkmode} class="sr-only" />
                            <!-- line -->
                            <div class="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                            <!-- dot -->
                            <div class="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
                        </div>
                        <!--heroicon moon-->
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /> </svg>
                    </label>
                </div>
            </div>
        </div>
        <div class="grid md:grid-cols-settings-sidebar gap-y-4">
            <div>
                <h2 class="font-semibold">Account</h2>
                <div class="mt-2 border-t md:border-0 dark:border-gray-500" />
            </div>
            <div class="flex flex-col mt-2 md:mt-1">
            </div>
        </div>
    </section>
</section>

<style>
    input ~ .dot {
        background-color: #60A5FA;
    }

    input:checked ~ .dot {
        transform: translateX(100%);
        background-color: #7C3AED;
    }
</style>

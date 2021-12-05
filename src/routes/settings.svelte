<script lang="ts">
    import '$lib/tailwind.css';
    import { fade } from 'svelte/transition';
    import { darkmode } from '$lib/stores/appearance';
    import { googleSignedIn, googleProfileImage, googleEmail } from '$lib/stores/sync';
    import { sl_threshold, nsfw_threshold } from '$lib/stores/nsfw';

    function toggleDarkmode() {
        darkmode.update(value => !value);
    }

    function signin() {
        gapi.auth2.getAuthInstance().signIn();
    }

    function signout() {
        gapi.auth2.getAuthInstance().signOut();
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
                <h2 class="font-semibold tracking-wide dark:text-gray-200">Appearance</h2>
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
                <h2 class="font-semibold tracking-wide dark:text-gray-200">Account</h2>
                <div class="mt-2 border-t md:border-0 dark:border-gray-500" />
            </div>
            <div class="mt-2 md:mt-1 w-full h-32">
                {#key $googleSignedIn}
                <div class="flex flex-col gap-2" in:fade="{{ duration: 500 }}">
                {#if !$googleSignedIn}
                <button class="py-2 px-2 gap-2 bg-white w-full rounded-lg shadow-md hover:shadow-lg flex flex-row items-center text-gray-500 hover:text-blue-700 transition duration-200" on:click={signin}>
                    <img class="w-8 h-8" src="/google_signin_buttons/web/vector/btn_google_light_normal_ios.svg" alt="Google sign in" />
                    <span class="flex-1 mr-2">Sign in with Google</span>
                </button>
                {:else}
                <div class="flex flex-row gap-4 items-center">
                    <img src={$googleProfileImage} class="rounded-full shadow-md cursor-pointer" alt="Google Profile" />
                    <div class="flex flex-col gap-2 items-center">
                        <button class="py-2 px-2 gap-2 bg-white w-full rounded-lg shadow-md hover:shadow-lg flex flex-row items-center text-gray-500 hover:text-blue-700 transition duration-200" on:click={signout}>
                            <img class="w-8 h-8" src="/google_signin_buttons/web/vector/btn_google_light_normal_ios.svg" alt="Google sign out" />
                            <span>Sign out</span>
                        </button>
                        <span class="dark:text-gray-100">{$googleEmail}</span>
                    </div>
                </div>
                {/if}
                </div>
                {/key}
            </div>
        </div>
        <div class="grid md:grid-cols-settings-sidebar gap-y-4 w-full">
            <div>
                <h2 class="font-semibold tracking-wide dark:text-gray-200">NSFW Threshold</h2>
                <div class="mt-2 border-t md:border-0 dark:border-gray-500" />
            </div>
            <div class="flex flex-col items-center gap-2 mt-2 md:mt-1 w-full md:w-96 h-16 relative">
                {#if $nsfw_threshold <= 0.33}
                <label for="nsfw-slider" class="mb-2 text-green-500">{($nsfw_threshold * 100).toFixed(2)}</label>
                {:else if $nsfw_threshold <= 0.66}
                <label for="nsfw-slider" class="mb-2 text-yellow-500">{($nsfw_threshold * 100).toFixed(2)}</label>
                {:else}
                <label for="nsfw-slider" class="mb-2 text-red-500">{($nsfw_threshold * 100).toFixed(2)}</label>
                {/if}
                <input type="range" min="0" max="1" step="0.0001" id="nsfw-slider" bind:value={$nsfw_threshold}
                       class="slider mt w-full" />
                <div class="flex flex-row justify-between w-full dark:text-gray-300">
                    <div>0</div>
                    <div>100</div>
                </div>
            </div>
        </div>
        <div class="grid md:grid-cols-settings-sidebar gap-y-4 w-full">
            <div>
                <h2 class="font-semibold tracking-wide dark:text-gray-200">SL Threshold</h2>
                <div class="mt-2 border-t md:border-0 dark:border-gray-500" />
            </div>
            <div class="flex flex-col items-center gap-2 mt-2 md:mt-1 w-full md:w-96 h-16 relative">
                {#if $sl_threshold <= 2}
                <label for="nsfw-slider" class="mb-2 text-green-500">{$sl_threshold}</label>
                {:else if $sl_threshold <= 4}
                <label for="nsfw-slider" class="mb-2 text-yellow-500">{$sl_threshold}</label>
                {:else}
                <label for="nsfw-slider" class="mb-2 text-red-500">{$sl_threshold}</label>
                {/if}
                <input type="range" min="2" max="6" step="2" id="nsfw-slider" bind:value={$sl_threshold}
                       class="slider mt w-full" />
                <div class="flex flex-row justify-between w-full dark:text-gray-300">
                    <div>2</div>
                    <div>6</div>
                </div>
            </div>
        </div>
    </section>
</section>

<style lang="postcss">
    input ~ .dot {
        background-color: #60A5FA;
    }

    input:checked ~ .dot {
        transform: translateX(100%);
        background-color: #7C3AED;
    }

    .slider {
        -webkit-appearance: none;
        width: 100%;
        height: 15px;
        border-radius: 5px;
        background: #d3d3d3;
        outline: none;
        opacity: 0.7;
        -webkit-transition: .2s;
        transition: opacity .2s;
    }

    .slider:hover {
        opacity: 1;
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: #04AA6D;
        cursor: pointer;
    }

    .slider::-moz-range-thumb {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: #04AA6D;
        cursor: pointer;
    }
</style>

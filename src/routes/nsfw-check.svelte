<script lang="ts" context="module">
    export function load({ session }) {
        const nsfwEndpoint = session.nsfwEndpoint;
        return {
            props: {
                nsfwEndpoint,
            },
        };
    }
</script>

<script lang="ts">
    import { onDestroy } from 'svelte';

    export let nsfwEndpoint = '';
    let files, fileInputElement;
    let loading = false;
    let predictResult = [];
    let objectUrls = [];

    async function onUpload() {
        loading = true;
        const formData = new FormData();
        const nameMap = {};
        for (let i = 0; i < files?.length; i++) {
            formData.append(`image_${i}`, files[i]);
            nameMap[`image_${i}`] = files[i];
        }
        clearInput();
        const res = await fetch(nsfwEndpoint, {
            method: 'POST',
            body:   formData,
        });
        if (res.ok) {
            const resultList = await res.json();
            const valids = resultList['valid'];
            for (const [ k, v ] of Object.entries(valids)) {
                predictResult.push({ 'file': nameMap[k], 'predict': v });
            }
        }
        loading = false;
    }

    function clearInput() {
        if (fileInputElement) {
            fileInputElement.value = null;
        }
    }

    function clearResult() {
        predictResult = [];
    }

    function parseNsfwResult(prediction) {
        const hentai = (prediction.hentai * 100);
        const porn = (prediction.porn * 100);
        const sexy = (prediction.sexy * 100);
        const drawings = (prediction.drawings * 100);
        const neutral = (prediction.neutral * 100);
        return {
            'nsfw': hentai + porn + sexy,
            'sfw':  drawings + neutral,
        };
    }

    function newObjectURL(obj) {
        const u = URL.createObjectURL(obj);
        objectUrls.push(u);
        return u;
    }

    onDestroy(() => {
        for (const objToFree of objectUrls) {
            URL.revokeObjectURL(objToFree);
        }
        objectUrls = [];
    });
</script>


<svelte:head>
    <title>NSFW Content Check - Genshin Picbed</title>
</svelte:head>

<section class="p-4 lg:p-8">
    <header>
        <h1 class="py-4 text-3xl">Indecent Content Detection</h1>
    </header>

    <div class="flex flex-row gap-2 my-4">
        <div class="w-56">
            <label class="flex flex-row items-center justify-center px-4 py-2 rounded-md shadow-md cursor-pointer bg-white text-blue-500 hover:bg-blue-500 hover:text-white dark:bg-gray-800 dark:hover:bg-blue-800 transition-all">
                <div class="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>
                <span class="mr-1 text-base leading-normal uppercase">Select a file</span>
                <input type="file" multiple class="hidden" accept="image/png,image/jpeg" bind:files bind:this={fileInputElement} />
            </label>
        </div>
        {#if predictResult && predictResult.length > 0}
            <button class="uppercase text-sm px-4 py-2 rounded-lg outline-none focus:outline-none transition-all dark:text-gray-200 bg-gray-200 hover:bg-gray-400 dark:bg-gray-800 dark:hover:bg-gray-600" on:click="{clearResult}">
                Clear
            </button>
        {/if}
    </div>


    {#if files && files?.length > 0}
        <div class="flex flex-col gap-2 max-w-screen-md px-10 py-6 mb-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <dl class="space-y-2">
                <dt class="text-lg font-medium text-gray-500 dark:text-gray-200">Upload list</dt>
            </dl>
            {#each files as file, i}
                <div class="flex flex-row w-full items-center gap-2 md:gap-4 lg:gap-8 pt-2 dark:text-gray-200">
                    <div class="w-4 text-center">{i+1}</div>
                    <div class="w-12 h-12"><img class="w-12 h-12 object-cover" src="{newObjectURL(file)}" alt="Upload image list {i}" /></div>
                    <div class="md:w-72 overflow-hidden">{file.name}</div>
                </div>
            {/each}
            <div class="flex flex-row place-items-end gap-2 px-2 pt-4">
                <span class="flex-1"></span>
                <button class="flex-0 uppercase text-sm px-4 py-2 rounded-lg outline-none focus:outline-none transition-all bg-gray-100 hover:bg-gray-300 dark:text-gray-200 bg-gray-200 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600" on:click="{clearInput}">Cancel</button>
                <button class="flex-0 uppercase text-sm px-4 py-2 rounded-lg outline-none focus:outline-none transition-all bg-blue-300 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-500" on:click="{onUpload}">Upload</button>
            </div>
        </div>
    {/if}

    {#if loading}
        <div class="flex justify-center items-center w-full">
            <div class="animate-spin rounded-full
                       h-32 w-32
                       border-t-2 border-b-2 border-purple-500
                 "
            ></div>
        </div>
    {:else if predictResult && predictResult.length > 0}
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 items-center">
            {#each predictResult as result, i}
            <div class="w-full h-full rounded-2xl shadow-md bg-white dark:bg-gray-800">
                <img src="{newObjectURL(result.file)}"
                     alt="Upload image result {i}"
                     class="h-64 w-full max-w-full
                          sm:h-80 sm:max-w-md md:max-w-lg
                          lg:h-72 lg:max-w-full
                          rounded-t-2xl object-cover"
                />
                <div class="flex flex-row gap-2 justify-between p-2 lg:p-4 bg-white dark:bg-gray-800 rounded-b-2xl">
                    <div>
                        <span class="text-xs uppercase text-center
                                     text-blue-600 bg-blue-200 inline-block
                                     py-1 px-2 rounded-full
                        ">
                            NSFW {parseNsfwResult(result.predict).nsfw.toFixed(2)}%
                        </span>
                    </div>
                    <div>
                        <span class="text-xs uppercase text-center
                                     text-blue-600 bg-blue-200 inline-block
                                     py-1 px-2 rounded-full
                        ">
                            SFW {parseNsfwResult(result.predict).sfw.toFixed(2)}%
                        </span>
                    </div>
                </div>
            </div>
            {/each}
        </div>
    {/if}
</section>

<script context="module" lang="ts">
    import { browser } from '$app/env';
    export const prerender = true;
    export const router = browser;
</script>

<script lang="ts">
    const characters = [
        { name: 'Aether',
          path: 'aether',
          avatar: '/avatar/aether.png', },
        { name: 'Albedo',
          path: 'albedo',
          avatar: '/avatar/albedo.png', },
        { name: 'Aloy',
          path: 'aloy',
          avatar: '/avatar/aloy.png', },
        { name: 'Amber',
          path: 'amber',
          avatar: '/avatar/amber.png', },
        { name: 'Ayaka',
          path: 'ayaka',
          avatar: '/avatar/ayaka.png', },
        { name: 'Barbara',
          path: 'barbara',
          avatar: '/avatar/barbara.png', },
        { name: 'Beidou',
          path: 'beidou',
          avatar: '/avatar/beidou.png', },
        { name: 'Bennett',
          path: 'bennett',
          avatar: '/avatar/bennett.png', },
        { name: 'Chongyun',
          path: 'chongyun',
          avatar: '/avatar/chongyun.png', },
        { name: 'Diluc',
          path: 'diluc',
          avatar: '/avatar/diluc.png', },
        { name: 'Diona',
          path: 'diona',
          avatar: '/avatar/diona.png', },
        { name: 'Eula',
          path: 'eula',
          avatar: '/avatar/eula.png', },
        { name: 'Fischl',
          path: 'fischl',
          avatar: '/avatar/fischl.png', },
        { name: 'Ganyu',
          path: 'ganyu',
          avatar: '/avatar/ganyu.png', },
        { name: 'Hu Tao',
          path: 'hutao',
          avatar: '/avatar/hutao.png', },
        { name: 'Jean',
          path: 'jean',
          avatar: '/avatar/jean.png', },
        { name: 'Kaeya',
          path: 'kaeya',
          avatar: '/avatar/kaeya.png', },
        { name: 'Kazuha',
          path: 'kazuha',
          avatar: '/avatar/kazuha.png', },
        { name: 'Keqing',
          path: 'keqing',
          avatar: '/avatar/keqing.png', },
        { name: 'Klee',
          path: 'klee',
          avatar: '/avatar/klee.png', },
        { name: 'Kokomi',
          path: 'kokomi',
          avatar: '/avatar/kokomi.png', },
        { name: 'Kujou Sara',
          path: 'kujousara',
          avatar: '/avatar/sara.png', },
        { name: 'Lisa',
          path: 'lisa',
          avatar: '/avatar/lisa.png', },
        { name: 'Lumine',
          path: 'lumine',
          avatar: '/avatar/lumine.png', },
        { name: 'Mona',
          path: 'mona',
          avatar: '/avatar/mona.png', },
        { name: 'Ningguang',
          path: 'ningguang',
          avatar: '/avatar/ningguang.png', },
        { name: 'Noelle',
          path: 'noelle',
          avatar: '/avatar/noelle.png', },
        { name: 'Qiqi',
          path: 'qiqi',
          avatar: '/avatar/qiqi.png', },
        { name: 'Razor',
          path: 'razor',
          avatar: '/avatar/razor.png', },
        { name: 'Raiden Shogun',
          path: 'raidenshogun',
          avatar: '/avatar/raiden.png', },
        { name: 'Rosaria',
          path: 'rosaria',
          avatar: '/avatar/rosaria.png', },
        { name: 'Sayu',
          path: 'sayu',
          avatar: '/avatar/sayu.png', },
        { name: 'Shenhe',
            path: 'shenhe',
            avatar: '/avatar/shenhe.png', },
        { name: 'Sucrose',
          path: 'sucrose',
          avatar: '/avatar/sucrose.png', },
        { name: 'Tartaglia',
          path: 'tartaglia',
          avatar: '/avatar/tartaglia.png', },
        { name: 'Thoma',
          path: 'thoma',
          avatar: '/avatar/thoma.png', },
        { name: 'Venti',
          path: 'venti',
          avatar: '/avatar/venti.png', },
        { name: 'Xiangling',
          path: 'xiangling',
          avatar: '/avatar/xiangling.png', },
        { name: 'Xiao',
          path: 'xiao',
          avatar: '/avatar/xiao.png', },
        { name: 'Xingqiu',
          path: 'xingqiu',
          avatar: '/avatar/xingqiu.png', },
        { name: 'Xinyan',
          path: 'xinyan',
          avatar: '/avatar/xinyan.png', },
        { name: 'Yanfei',
          path: 'yanfei',
          avatar: '/avatar/yanfei.png', },
        { name: 'Yoimiya',
          path: 'yoimiya',
          avatar: '/avatar/yoimiya.png', },
        { name: 'Yunjin',
          path: 'yunjin',
          avatar: '/avatar/yunjin.png', },
        { name: 'Zhongli',
          path: 'zhongli',
          avatar: '/avatar/zhongli.png', },
    ];
</script>

<svelte:head>
    <title>Characters - Genshin Picbed</title>
</svelte:head>

<div class="p-4 lg:p-8">
    <header class="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md lg:hidden">
        <span class="font-semibold antialiased text-lg text-black dark:text-gray-100">Characters</span>
    </header>

    <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 w-full
                gap-2 sm:gap-8 md:gap-8 mt-4 max-w-screen-xl">
        {#each characters as character (character.name)}
            <a sveltekit:prefetch href="/character/{character.path}" class="group hover:no-underline">
                <div class="rounded-xl shadow w-full">
                    <img class="rounded-t-xl w-full transition ease-in-out duration-300
                                bg-white group-hover:bg-blue-500 dark:bg-gray-800 dark:group-hover:bg-blue-500"
                         src="{character.avatar}" alt="{character.name}" />
                    <div class="rounded-b-xl w-full py-2 bg-gray-300 dark:bg-gray-700 text-xs xl:text-sm text-center">
                        <span class="text-gray-800 transition ease-in-out duration-300 dark:text-white
                                     tracking-wide group-hover:text-blue-500">{character.name}</span>
                    </div>
                </div>
            </a>
        {/each}
    </div>
</div>

<style>
</style>

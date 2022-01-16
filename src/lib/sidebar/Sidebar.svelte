<script lang="ts">
    import { page } from '$app/stores';
    import FloatingAction from '$lib/FloatingAction.svelte';
    import ScrollToTopButton from '$lib/ScrollToTopButton.svelte';

    let sidebarOpen = false;
    let y: number = 0;

    const paths = [
        {
            path: '/',
            href: '/',
            name: 'Home',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> </svg>',
        },
        {
            path: '/characters',
            href: '/characters',
            name: 'Characters',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /> </svg>',
        },
        {
            path: '/nsfw-check',
            href: '/nsfw-check',
            name: 'NSFW Check',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> </svg>',
        },
        {
            path: '/about',
            href: '/about',
            name: 'About',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> </svg>',
        },
        {
            path: '/statistics',
            href: '/statistics',
            name: 'Statistics',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /> </svg>',
        },
        {
            path: '/settings',
            href: '/settings',
            name: 'Settings',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> </svg>',
        },
    ];

    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
    }

    function closeSidebar() {
        sidebarOpen = false;
    }

    function scrollToTop() {
        if (window && window.scrollTo) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            y = 0;
        }
    }
</script>

<svelte:window bind:scrollY={y} />

<!--Mobile-->
<FloatingAction>
    <!-- Scroll to Top -->
    <!-- **DO NOT use if-directive on scroll button. Will break navigation -->
    <ScrollToTopButton class={"p-4 z-10 rounded-full shadow-lg bg-blue-200 dark:text-gray-100 dark:bg-blue-800 hover:bg-blue-500 dark:hover:bg-blue-500 outline-none transition ease-in-out" + (y > 1024 ? " block" : " hidden")}
                       on:click={scrollToTop} />
    <!-- Toggle sidebar (mobile only) -->
    <button class="p-4 z-10 rounded-full shadow-lg bg-blue-200 dark:text-gray-100 dark:bg-blue-800 hover:bg-blue-500 dark:hover:bg-blue-500 lg:hidden outline-none {sidebarOpen ? 'hidden' : 'flex'}"
            on:click={toggleSidebar}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /> </svg>
    </button>
</FloatingAction>
<!--PC-->
<div class="p-0 flex-row w-screen h-screen z-10 fixed {sidebarOpen ? 'flex' : 'hidden'} lg:flex lg:w-64 dark:bg-black">
    <div class="lg:mx-6 lg:my-8 bg-white rounded-2xl shadow-xl w-full flex flex-col justify-items-start dark:bg-gray-800">
        <div class="justify-center p-8 w-screen cursor-pointer dark:text-gray-50 lg:hidden {sidebarOpen ? 'flex' : 'hidden'}"
             on:click="{closeSidebar}">
            <!--heroicons.com x-circle-->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <nav class="pt-2 px-4 overflow-y-auto flex-grow">
            <ul class="relative m-0 p-0 w-full h-full lg:w-full flex flex-col items-start list-none">
                {#each paths as path}
                    <li class:active={$page.url.pathname === path.path}
                        class="group transition duration-300 ease-in-out transform lg:hover:scale-x-110"
                        on:click="{closeSidebar}">
                        <a class="relative h-12 pl-2 flex lg:flex flex-row items-center text-gray-500 group-hover:text-red-500 dark:text-gray-300 dark:group-hover:text-red-500"
                           href={path.href}
                           sveltekit:prefetch
                        >
                            {@html path.icon}
                            <span class={"pl-4 font-bold text-md uppercase flex-grow w-full" + 
                                         "tracking-tight no-underline transition-colors"}>
                                {path.name}
                            </span>
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>
    </div>
</div>


<style>
    li.active a {
        color: var(--accent-color);
    }

	nav a {
		padding: 0 1em;
	}
</style>

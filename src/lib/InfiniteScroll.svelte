<script lang="ts">
    // https://github.com/andrelmlins/svelte-infinite-scroll
    // https://svelte.dev/repl/4863a658f3584b81bbe3d9f54eb67899?version=3.32.3
    import { onMount, onDestroy, createEventDispatcher } from 'svelte';

    export let threshold: number = 0;
    export let horizontal: boolean = false;
    export let elementScroll: HTMLElement | null = null;
    export let hasMore: boolean = true;
    export let window: boolean = false;

    const dispatch = createEventDispatcher();
    let isLoadMore: boolean = false;
    let component: HTMLElement;
    let element: any | null;

    $: {
        if (element) {
            element.addEventListener('scroll', onScroll);
            element.addEventListener('resize', onScroll);
        }
    }

    function onScroll(e: Event) {
        if (!hasMore) return;

        const target = e.target as HTMLElement;
        const offset = calcOffset(target, horizontal);
        // console.log(`scroll - offset=${offset}`);
        if (offset <= threshold) {
            if (!isLoadMore && hasMore) {
                dispatch('more');
            }
            isLoadMore = true;
        } else {
            isLoadMore = false;
        }
    }

    function calcOffset(target: any, horizontal: boolean) {
        const element: HTMLElement = target.documentElement
            ? target.documentElement
            : target;
        return horizontal
            ? element.scrollWidth - element.clientWidth - element.scrollLeft
            : element.scrollHeight - element.clientHeight - element.scrollTop;
    };

    onMount(() => {
        if (window) {
            element = document;
        } else if (elementScroll) {
            element = elementScroll;
        } else {
            element = component.parentNode;
        }
        const target = element;
        const offset = calcOffset(target, horizontal);
        // console.log(`scroll - offset=${offset}`);
        if (offset <= threshold) {
            if (hasMore) {
                dispatch('more');
            }
            isLoadMore = true;
        } else {
            isLoadMore = false;
        }
    });

    onDestroy(() => {
        if (element) {
            element.removeEventListener('scroll', onScroll);
            element.removeEventListener('resize', onScroll);
        }
    });
</script>

{#if !window && !elementScroll}
    <div bind:this={component} style="width: 0;"></div>
{/if}

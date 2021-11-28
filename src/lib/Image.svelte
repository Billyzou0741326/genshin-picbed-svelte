<script lang="ts">
    import { onMount } from 'svelte';

    let clazz = '';
    let loaded = false;
    let thisImage: HTMLElement | null = null;
    let imgClass = '';
    export let blurLazyLoad: boolean = false;
    export let srcset: string = '';
    export let src: string = '';
    export let alt: string = '';
    export { clazz as class };

    $: imgClass = ((!blurLazyLoad || loaded) ? '' : 'filter blur-lg') + (clazz ? (' '+clazz) : '');

    onMount(() => {
        thisImage.onload = () => {
            loaded = true;
        };
    });
</script>

<img {src} {srcset} {alt} class="{imgClass} m-0 p-0" bind:this={thisImage} />

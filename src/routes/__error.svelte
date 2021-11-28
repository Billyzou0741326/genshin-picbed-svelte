<script context="module" lang="ts">
    export function load({ error, status }) {
        return {
            props: {
                title: `${status}: ${error.message}`,
                error: error,
            },
        };
    }
</script>

<script lang="ts">
    export let title;
    export let error;
</script>

<div class="pt-16 px-4 mb-0 lg:px-16 md:pt-8">
    <header>
        <h1 class="mt-4 text-3xl">{title}</h1>
    </header>

    <div class="mt-4">
        {#if error.stack}
            {error.stack}
        {:else}
            {error}
        {/if}
    </div>
</div>

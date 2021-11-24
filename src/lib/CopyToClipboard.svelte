<script lang="ts">
    import { onDestroy } from 'svelte';

    let className: string = '';
    let visible: boolean = false;
    let timeoutRet: ReturnType<typeof setTimeout> | null = null;
    export let value: string = '';
    export { className as class };

    function copy() {
        navigator.clipboard.writeText(value);
        visible = true;
        timeoutRet = setTimeout(() => {
            visible = false;
            timeoutRet = null;
        }, 1500);
    }

    function copyAskNicely() {
        // Firefox dislikes the permission 'clipboard-write'
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
            if (!navigator.permissions || !navigator.permissions.query) {
                navigator.clipboard.writeText(value);
                visible = true;
                timeoutRet = setTimeout(() => {
                    visible = false;
                    timeoutRet = null;
                }, 1500);
                return;
            }
            const permissionName = 'clipboard-write' as PermissionName;
            try {
                navigator.permissions.query({ name: permissionName }).then((result) => {
                    if (result.state === 'granted' || result.state === 'prompt') {
                        navigator.clipboard.writeText(value);
                        visible = true;
                        timeoutRet = setTimeout(() => {
                            visible = false;
                            timeoutRet = null;
                        }, 1500);
                    }
                }, (error) => {
                    console.error(error);
                });
            } catch (error) {
                const el = document.createElement('input');
                el.value = value;
                el.select();
                if (document.execCommand('copy')) {
                    visible = true;
                    timeoutRet = setTimeout(() => {
                        visible = false;
                        timeoutRet = null;
                    }, 1500);
                }
            }
        }
    }

    onDestroy(() => {
        if (timeoutRet !== null) {
            clearTimeout(timeoutRet);
            timeoutRet = null;
        }
    });
</script>

<button class={"relative " + className} on:click={copy}>
    <slot name="icon" />
    <div class={"absolute left-6 top-0 px-1 bg-white dark:bg-gray-800 rounded-lg text-green-500 text-xs transition-opacity ease-in-out duration-700 " +
                (visible ? "opacity-100 inline-block" : "opacity-0 hidden")}>Copied!</div>
</button>

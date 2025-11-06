<script lang="ts">
    import { copy } from 'svelte-copy';
    import { queryLibrary } from '$lib/remote/book.remote';
    let text: string = $state("");

    async function getLibrary(){
        text = JSON.stringify(await queryLibrary());
    }
</script>


{#if text !== ""}
<button class="btn btn-info" use:copy={{ text }}>
    Copy
</button>
<pre>
    {text}
</pre>
{:else}
<button class="btn" onclick={getLibrary}>JSON library</button>
{/if}
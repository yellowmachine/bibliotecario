<script lang="ts">
	import Library from "$lib/components/Library.svelte"
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<Library books={data.books} />
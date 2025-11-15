<script lang="ts">
	import MovieLibrary from '$lib/components/MovieLibrary.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<MovieLibrary movies={data.movies} />
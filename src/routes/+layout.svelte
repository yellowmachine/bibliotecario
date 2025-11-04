<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import UserSession from '$lib/components/UserSession.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<UserSession />

{@render children()}

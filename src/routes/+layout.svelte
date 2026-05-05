<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}

<style>
	:global(body) {
		background-color: #141315;
		margin: 0;
	}
	:global(span){
		font-smooth: never;
		-webkit-font-smoothing : none;
	}
	:global(p){
		font-smooth: never;
		-webkit-font-smoothing : none;
	}
</style>

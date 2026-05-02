<script lang="ts">
	import { onMount } from 'svelte';

	let { title = 'window', children } = $props();

	let el: HTMLElement;
	let dragging = false;
	let x = $state(40);
	let y = $state(40);
	let startX = 0,
		startY = 0;
	let minimized = $state(false);

	function onMousedown(e: MouseEvent) {
		dragging = true;
		startX = e.clientX - x;
		startY = e.clientY - y;
	}

	onMount(() => {
		const move = (e: MouseEvent) => {
			if (!dragging) return;
			x = e.clientX - startX;
			y = e.clientY - startY;
		};
		const up = () => (dragging = false);
		window.addEventListener('mousemove', move);
		window.addEventListener('mouseup', up);
		return () => {
			window.removeEventListener('mousemove', move);
			window.removeEventListener('mouseup', up);
		};
	});
</script>

<div
	bind:this={el}
	class="fixed z-50 flex w-80 flex-col border border-zinc-700 bg-zinc-950"
	style="left: {x}px; top: {y}px;"
>
	<!-- titlebar -->
	<div
		role="toolbar"
		tabindex="0"
		onmousedown={onMousedown}
		class="flex cursor-grab items-center justify-between border-b border-zinc-700 px-2 py-1 select-none active:cursor-grabbing"
	>
		<span class="font-terminus text-sm text-comment">// {title}</span>
		<button
			onclick={() => (minimized = !minimized)}
			class="px-1 text-xs text-zinc-500 hover:text-zinc-200"
		>
			{minimized ? '▲' : '▼'}
		</button>
	</div>

	<!-- content -->
	{#if !minimized}
		<div class="flex flex-col" style="height: 320px;">
			{@render children()}
		</div>
	{/if}
</div>

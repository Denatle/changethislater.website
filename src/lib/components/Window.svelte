<script lang="ts">
	import { onMount } from 'svelte';

	let { title = 'window', children } = $props();

	let el: HTMLElement;
	let dragging = false;
	let dx = $state(0);
	let dy = $state(0);
	let startX = 0, startY = 0;
	let minimized = $state(false);

	function startDrag(clientX: number, clientY: number) {
		dragging = true;
		startX = clientX - dx;
		startY = clientY - dy;
	}

	function onMousedown(e: MouseEvent) {
		startDrag(e.clientX, e.clientY);
	}

	function onTouchstart(e: TouchEvent) {
		const t = e.touches[0];
		startDrag(t.clientX, t.clientY);
	}

	onMount(() => {
		const onMousemove = (e: MouseEvent) => {
			if (!dragging) return;
			dx = e.clientX - startX;
			dy = e.clientY - startY;
		};

		const onTouchmove = (e: TouchEvent) => {
			if (!dragging) return;
			e.preventDefault();
			const t = e.touches[0];
			dx = t.clientX - startX;
			dy = t.clientY - startY;
		};

		const stopDrag = () => (dragging = false);

		window.addEventListener('mousemove', onMousemove);
		window.addEventListener('mouseup', stopDrag);
		window.addEventListener('touchmove', onTouchmove, { passive: false });
		window.addEventListener('touchend', stopDrag);

		return () => {
			window.removeEventListener('mousemove', onMousemove);
			window.removeEventListener('mouseup', stopDrag);
			window.removeEventListener('touchmove', onTouchmove);
			window.removeEventListener('touchend', stopDrag);
		};
	});
</script>

<div
	bind:this={el}
	class="relative z-50 flex w-80 flex-col border border-zinc-700 bg-zinc-950"
	style="transform: translate({dx}px, {dy}px);"
>
	<!-- titlebar -->
	<div
		role="toolbar"
		tabindex="0"
		onmousedown={onMousedown}
		ontouchstart={onTouchstart}
		class="flex cursor-grab touch-none items-center justify-between border-b border-zinc-700 px-2 py-1 select-none active:cursor-grabbing"
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
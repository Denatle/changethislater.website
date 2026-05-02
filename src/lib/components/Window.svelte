<script lang="ts">
	import { onMount } from 'svelte';

	let { title = 'window', children } = $props();

	let el: HTMLElement;
	let dragging = false;
	let x = $state(0);
	let y = $state(0);
	let startX = 0, startY = 0;
	let minimized = $state(false);
	let detached = $state(false);

	function startDrag(clientX: number, clientY: number) {
		if (!detached) {
			const rect = el.getBoundingClientRect();
			x = rect.left;
			y = rect.top;
			detached = true;
		}
		dragging = true;
		startX = clientX - x;
		startY = clientY - y;
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
			x = e.clientX - startX;
			y = e.clientY - startY;
		};

		const onTouchmove = (e: TouchEvent) => {
			if (!dragging) return;
			e.preventDefault();
			const t = e.touches[0];
			x = t.clientX - startX;
			y = t.clientY - startY;
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
	class="z-50 flex w-80 flex-col border border-zinc-700 bg-zinc-950 {detached ? 'fixed' : 'relative'}"
	style={detached ? `left: ${x}px; top: ${y}px;` : ''}
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
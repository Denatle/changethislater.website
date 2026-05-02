<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface Msg {
		name: string;
		text: string;
		time: string;
	}

	let messages: Msg[] = $state([]);
	let input = $state('');
	let username = $state('');
	let sse: EventSource | null = null;
	let connected = $state(false);
	let bottomEl: HTMLElement;

	onMount(() => {
		sse = new EventSource('/chat');
		sse.onopen = () => (connected = true);
		sse.onerror = () => (connected = false);
		sse.onmessage = (e) => {
			messages = [...messages, JSON.parse(e.data)];
			setTimeout(() => bottomEl?.scrollIntoView(), 0);
		};
	});

	onDestroy(() => sse?.close());

	async function send() {
		if (!input.trim()) return;
		await fetch('/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: username.trim() || 'anon',
				text: input.trim(),
				time: new Date().toLocaleTimeString()
			})
		});
		input = '';
	}
</script>

<div class="flex h-full flex-col gap-2 p-2 font-terminus">
	<div class="flex flex-1 flex-col gap-1 overflow-y-auto text-sm">
		{#each messages as msg}
			<div class="flex flex-wrap gap-2">
				<span class="text-comment">//</span>
				<span class="text-zinc-400">{msg.name}</span>
				<span class="text-zinc-100">{msg.text}</span>
			</div>
		{/each}
		<div bind:this={bottomEl}></div>
	</div>

	<input
		bind:value={username}
		placeholder="имичко"
		class="w-full border border-zinc-700 bg-transparent px-2 py-1 text-sm text-zinc-400 outline-none"
	/>
	<div class="flex gap-2">
		<input
			bind:value={input}
			onkeydown={(e) => e.key === 'Enter' && send()}
			placeholder="сообщенке..."
			class="flex-1 border border-zinc-700 bg-transparent px-2 py-1 text-sm text-zinc-400 outline-none"
		/>
		<button onclick={send} class="border border-zinc-700 px-2 py-1 text-sm hover:text-comment">
			»
		</button>
	</div>

	<div class="text-xs text-zinc-600">
		<span class="text-comment">//</span>
		{connected ? 'connected' : 'disconnected'}
	</div>
</div>

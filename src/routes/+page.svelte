<script lang="ts">
	import Window from '$lib/components/Window.svelte';
	import Chat from '$lib/components/Chat.svelte';
</script>

<div class="container mx-auto mt-10 flex flex-col items-center gap-y-5 px-15">
	<span class="font-terminus text-3xl text-comment">// ПРИВЕЕТ!!</span>
	<img src="/img/catwave.gif" alt="Cat waving" />

	<span class="font-terminus text-3xl text-comment">// КАК ТЫ НАШËЛ ЭТО???</span>

	<Window title="комментики (??)">
		<Chat />
	</Window>
</div>



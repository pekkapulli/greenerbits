<script lang="ts">
	const { open, onClose, color } = $props();

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) {
			onClose();
		}
	}

	$effect(() => {
		if (open) {
			window.addEventListener('keydown', handleKeydown);
			return () => window.removeEventListener('keydown', handleKeydown);
		}
	});
</script>

{#if open}
	<div
		style="background-color: {color}cc;"
		class="fixed inset-0 z-50 flex items-center justify-center"
		tabindex="-1"
		aria-modal="true"
		role="dialog"
	>
		<div class="bg-white rounded-lg shadow-lg max-w-lg w-full px-12 py-6 relative">
			<button
				class="absolute top-2 right-6 text-gray-500 hover:text-gray-800 text-xl font-bold cursor-pointer"
				aria-label="Close"
				tabindex="0"
				onclick={onClose}
			>
				&times;
			</button>
			<slot />
		</div>
	</div>
{/if}

<style>
	:global(body) {
		overflow: hidden;
	}
</style>

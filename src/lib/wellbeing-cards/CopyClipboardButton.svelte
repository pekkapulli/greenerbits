<script lang="ts">
	import { onDestroy } from 'svelte';

	import Button from '$lib/wellbeing-cards/Button.svelte';

	interface Props {
		value: string;
		idleLabel: string;
		successLabel: string;
		errorLabel: string;
		disabled?: boolean;
		class?: string;
	}

	let {
		value,
		idleLabel,
		successLabel,
		errorLabel,
		disabled = false,
		class: className = ''
	}: Props = $props();

	let status = $state<'idle' | 'success' | 'error'>('idle');
	let resetTimer: ReturnType<typeof setTimeout> | null = null;

	function scheduleReset() {
		if (resetTimer) {
			clearTimeout(resetTimer);
		}

		resetTimer = setTimeout(() => {
			status = 'idle';
			resetTimer = null;
		}, 1600);
	}

	async function copyValue() {
		if (disabled) {
			return;
		}

		try {
			await navigator.clipboard.writeText(value);
			status = 'success';
		} catch {
			status = 'error';
		}

		scheduleReset();
	}

	onDestroy(() => {
		if (resetTimer) {
			clearTimeout(resetTimer);
		}
	});
</script>

<Button onclick={copyValue} {disabled} variant={status === 'success' ? 'solid' : 'glass'} class={className}>
	{status === 'success' ? successLabel : status === 'error' ? errorLabel : idleLabel}
</Button>
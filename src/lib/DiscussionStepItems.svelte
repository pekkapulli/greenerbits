<script lang="ts">
	interface Props {
		step: 1 | 2 | 3;
	}

	const { step }: Props = $props();
</script>

<div class="grid grid-cols-3 gap-2 text-sm">
	<div
		class="rounded-md px-3 py-2 text-center {step >= 1
			? 'bg-green-600 text-white'
			: 'bg-gray-200 text-gray-700'}"
	>
		Step 1
	</div>
	<div
		class="rounded-md px-3 py-2 text-center {step >= 2
			? 'bg-green-600 text-white'
			: 'bg-gray-200 text-gray-700'}"
	>
		Step 2
	</div>
	<div
		class="rounded-md px-3 py-2 text-center {step >= 3
			? 'bg-green-600 text-white'
			: 'bg-gray-200 text-gray-700'}"
	>
		Step 3
	</div>
</div>

<script lang="ts">
	interface Props {
		size?: number;
	}

	const { size = 20 }: Props = $props();
</script>

<div class="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<circle cx="9" cy="5" r="1" />
		<circle cx="9" cy="12" r="1" />
		<circle cx="9" cy="19" r="1" />
		<circle cx="15" cy="5" r="1" />
		<circle cx="15" cy="12" r="1" />
		<circle cx="15" cy="19" r="1" />
	</svg>
</div>

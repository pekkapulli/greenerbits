<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type ButtonVariant = 'glass' | 'solid' | 'bare';
	type ButtonSize = 'md' | 'lg' | 'none';

	interface Props extends Omit<HTMLButtonAttributes, 'onclick'> {
		children?: Snippet;
		variant?: ButtonVariant;
		size?: ButtonSize;
		element?: HTMLButtonElement | null;
		onclick?: (event: MouseEvent) => void;
		href?: string;
		target?: string;
		rel?: string;
	}

	let {
		children,
		variant = 'glass',
		size = 'md',
		element = $bindable<HTMLButtonElement | null>(null),
		class: className = '',
		type = 'button',
		disabled = false,
		style = undefined,
		onclick,
		onpointerdown,
		'aria-pressed': ariaPressed = undefined,
		href = undefined,
		target = undefined,
		rel = undefined
	}: Props = $props();

	const variantClasses: Record<ButtonVariant, string> = {
		glass:
			'rounded-full border border-white/70 bg-white/70 text-sm font-medium text-stone-700 backdrop-blur transition hover:bg-white',
		solid:
			'rounded-full border border-stone-700/20 bg-stone-900 text-sm font-medium text-white backdrop-blur transition hover:bg-stone-800',
		bare: 'transition'
	};

	const sizeClasses: Record<ButtonSize, string> = {
		md: 'px-4 py-2',
		lg: 'px-5 py-3',
		none: ''
	};

	const buttonClasses = $derived(
		`${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'} ${className}`.trim()
	);

	const anchorAttributes = $derived({
		href: disabled ? undefined : href,
		target,
		rel: target === '_blank' ? (rel ?? 'noopener noreferrer') : rel,
		style,
		'aria-disabled': disabled,
		class: buttonClasses
	});

	function handleAnchorClick(event: MouseEvent) {
		if (disabled) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}

		onclick?.(event);
	}
</script>

{#if href}
	<a {...anchorAttributes} onclick={handleAnchorClick}>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={element}
		{type}
		{disabled}
		{style}
		{onclick}
		{onpointerdown}
		aria-pressed={ariaPressed}
		class={buttonClasses}
	>
		{@render children?.()}
	</button>
{/if}

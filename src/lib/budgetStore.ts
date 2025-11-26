import { writable, derived } from 'svelte/store';

// Carbon footprint data for different lifestyle choices (tonnes CO₂e per person per year)

export interface CategoryOption {
	label: string;
	value: number; // tonnes CO₂e per year
	description?: string;
}

export type CategoryKey = 'transportation' | 'housing' | 'food' | 'goods' | 'digital';

export interface Category {
	id: CategoryKey;
	name: string;
	color: string;
	options: CategoryOption[];
}

// Budget categories with their options
export const categories: Record<CategoryKey, Category> = {
	transportation: {
		id: 'transportation',
		name: 'Transportation',
		color: '#34D399',
		options: [
			{
				label: 'Car-dependent (15,000+ km/year)',
				value: 4.5,
				description: 'Daily car commute, frequent driving'
			},
			{
				label: 'Regular car use (10,000 km/year)',
				value: 3.2,
				description: 'Car for commute and errands'
			},
			{
				label: 'Occasional car use (5,000 km/year)',
				value: 1.6,
				description: 'Mostly public transport, some car trips'
			},
			{
				label: 'Public transport & cycling',
				value: 0.5,
				description: 'Bus, train, bike for daily transport'
			},
			{
				label: 'Walking & cycling only',
				value: 0.1,
				description: 'No motorized transport'
			}
		]
	},
	housing: {
		id: 'housing',
		name: 'Housing',
		color: '#60A5FA',
		options: [
			{
				label: 'Large house, gas heating',
				value: 4.2,
				description: '200+ m², fossil fuel heating/cooling'
			},
			{
				label: 'Average house, mixed energy',
				value: 2.8,
				description: '100-200 m², grid electricity + gas'
			},
			{
				label: 'Small apartment, electric heating',
				value: 1.8,
				description: '50-100 m², standard grid electricity'
			},
			{
				label: 'Efficient apartment, renewable energy',
				value: 0.8,
				description: 'Well-insulated, green energy contract'
			},
			{
				label: 'Passive house, solar panels',
				value: 0.3,
				description: 'Ultra-efficient, self-generated renewable'
			}
		]
	},
	food: {
		id: 'food',
		name: 'Food',
		color: '#FBBF24',
		options: [
			{
				label: 'High meat diet (daily beef)',
				value: 3.3,
				description: 'Red meat daily, high dairy consumption'
			},
			{
				label: 'Average Western diet',
				value: 2.5,
				description: 'Meat 4-5 times/week, regular dairy'
			},
			{
				label: 'Low meat diet (poultry & fish)',
				value: 1.7,
				description: 'Mostly chicken/fish, reduced dairy'
			},
			{
				label: 'Vegetarian',
				value: 1.2,
				description: 'No meat, eggs and dairy included'
			},
			{
				label: 'Vegan, local & seasonal',
				value: 0.8,
				description: 'Plant-based, locally sourced'
			}
		]
	},
	goods: {
		id: 'goods',
		name: 'Goods & Services',
		color: '#F87171',
		options: [
			{
				label: 'High consumption lifestyle',
				value: 3.5,
				description: 'Frequent shopping, latest gadgets, fast fashion'
			},
			{
				label: 'Average consumption',
				value: 2.0,
				description: 'Regular purchases, some new electronics'
			},
			{
				label: 'Mindful consumption',
				value: 1.2,
				description: 'Buy less, prioritize quality over quantity'
			},
			{
				label: 'Minimalist lifestyle',
				value: 0.6,
				description: 'Buy only necessities, repair & reuse'
			},
			{
				label: 'Second-hand & sharing economy',
				value: 0.3,
				description: 'Used goods, sharing, minimal new purchases'
			}
		]
	},
	digital: {
		id: 'digital',
		name: 'Digital Consumption',
		color: '#A78BFA',
		options: [
			{
				label: 'Heavy user (streaming 4K, gaming)',
				value: 0.8,
				description: 'Multiple devices, high-res streaming, cloud gaming'
			},
			{
				label: 'Average digital lifestyle',
				value: 0.5,
				description: 'Daily streaming, social media, video calls'
			},
			{
				label: 'Moderate use',
				value: 0.3,
				description: 'Selective streaming, efficient devices'
			},
			{
				label: 'Low digital footprint',
				value: 0.15,
				description: 'Minimal streaming, keep devices longer'
			},
			{
				label: 'Minimal digital use',
				value: 0.05,
				description: 'Basic internet use, old devices'
			}
		]
	}
};

// State: selected option index for each category
export interface BudgetState {
	transportation: number;
	housing: number;
	food: number;
	goods: number;
	digital: number;
}

// Default state (average Western lifestyle)
const defaultState: BudgetState = {
	transportation: 1, // Regular car use
	housing: 1, // Average house
	food: 1, // Average Western diet
	goods: 1, // Average consumption
	digital: 1 // Average digital lifestyle
};

export const budgetState = writable<BudgetState>(defaultState);

// Derived store: calculate current carbon footprint for each category
export const currentFootprint = derived(budgetState, ($state) => {
	return Object.entries(categories).map(([key, category]) => {
		const selectedIndex = $state[key as keyof BudgetState];
		const option = category.options[selectedIndex];
		return {
			id: category.id,
			name: category.name,
			color: category.color,
			value: option.value
		};
	});
});

// Derived store: total carbon footprint
export const totalFootprint = derived(currentFootprint, ($footprint) => {
	return $footprint.reduce((sum, item) => sum + item.value, 0);
});

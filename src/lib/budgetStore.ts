import { writable, derived } from 'svelte/store';

// Carbon footprint data for different lifestyle choices (tonnes CO₂e per person per year)

export interface SubcategoryOption {
	label: string;
	value: number; // tonnes CO₂e per year
	description?: string;
}

export interface Subcategory {
	id: string;
	name: string;
	options: SubcategoryOption[];
}

export type CategoryKey = 'transportation' | 'housing' | 'food' | 'goods' | 'digital';

export interface Category {
	id: CategoryKey;
	name: string;
	color: string;
	subcategories: Subcategory[];
}

// Budget categories with their subcategories
export const categories: Record<CategoryKey, Category> = {
	transportation: {
		id: 'transportation',
		name: 'Transportation',
		color: '#34D399',
		subcategories: [
			{
				id: 'daily',
				name: 'Daily Transportation',
				options: [
					{
						label: 'Car-dependent (15,000+ km/year)',
						value: 3.0,
						description: 'Daily car commute, frequent driving'
					},
					{
						label: 'Regular car use (10,000 km/year)',
						value: 2.0,
						description: 'Car for commute and errands'
					},
					{
						label: 'Occasional car use (5,000 km/year)',
						value: 1.0,
						description: 'Mostly public transport, some car trips'
					},
					{
						label: 'Public transport & cycling',
						value: 0.3,
						description: 'Bus, train, bike for daily transport'
					},
					{
						label: 'Walking & cycling only',
						value: 0.05,
						description: 'No motorized transport'
					}
				]
			},
			{
				id: 'flights',
				name: 'Holiday Flights',
				options: [
					{
						label: 'Multiple long-haul flights (3+ per year)',
						value: 3.0,
						description: 'Frequent international travel'
					},
					{
						label: '1-2 long-haul flights per year',
						value: 1.5,
						description: 'Occasional intercontinental trips'
					},
					{
						label: 'Short-haul flights only (2-3 per year)',
						value: 0.6,
						description: 'Regional European travel'
					},
					{
						label: '1 short-haul flight per year',
						value: 0.2,
						description: 'Rare air travel'
					},
					{
						label: 'No flights',
						value: 0.0,
						description: 'Train or no holiday travel'
					}
				]
			}
		]
	},
	housing: {
		id: 'housing',
		name: 'Housing',
		color: '#60A5FA',
		subcategories: [
			{
				id: 'energy',
				name: 'Home Energy',
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
			}
		]
	},
	food: {
		id: 'food',
		name: 'Food',
		color: '#FBBF24',
		subcategories: [
			{
				id: 'diet',
				name: 'Diet Type',
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
			}
		]
	},
	goods: {
		id: 'goods',
		name: 'Goods & Services',
		color: '#F87171',
		subcategories: [
			{
				id: 'consumption',
				name: 'Shopping Habits',
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
			}
		]
	},
	digital: {
		id: 'digital',
		name: 'Digital Consumption',
		color: '#A78BFA',
		subcategories: [
			{
				id: 'usage',
				name: 'Digital Usage',
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
		]
	}
};

// State: selected option index for each subcategory
export interface Subcategoriestate {
	[subcategoryId: string]: number; // subcategoryId -> selected option index
}

export interface BudgetState {
	transportation?: Subcategoriestate;
	housing?: Subcategoriestate;
	food?: Subcategoriestate;
	goods?: Subcategoriestate;
	digital?: Subcategoriestate;
}

// Default state (average Western lifestyle)
const defaultState: BudgetState = {};

export const budgetState = writable<BudgetState>(defaultState);

// Derived store: calculate current carbon footprint for each category
// Only include categories that exist in the state
export const currentFootprint = derived(budgetState, ($state) => {
	return Object.entries($state)
		.map(([key, categoryState]) => {
			const category = categories[key as CategoryKey];
			if (!category) return null;

			// Sum up all subcategories for this category
			const totalValue = category.subcategories.reduce((sum, subcategory) => {
				const selectedIndex = categoryState?.[subcategory.id] ?? undefined;
				const option = selectedIndex !== undefined ? subcategory.options[selectedIndex] : undefined;
				return sum + (option ? option.value : 0);
			}, 0);

			return {
				id: category.id,
				name: category.name,
				color: category.color,
				value: totalValue
			};
		})
		.filter((item) => item !== null);
});

// Derived store: total carbon footprint
export const totalFootprint = derived(currentFootprint, ($footprint) => {
	return $footprint.reduce((sum, item) => sum + item.value, 0);
});

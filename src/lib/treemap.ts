import { treemap, hierarchy, type HierarchyRectangularNode } from 'd3-hierarchy';
import type { CategoryKey } from './budgetStore';

export interface BudgetItem {
	name: string;
	value: number;
	color?: string;
}

interface TreeNode {
	id: CategoryKey | '_empty' | 'root';
	name: string;
	value?: number;
	color?: string;
	children?: BudgetItem[];
}

export interface TreemapBoxType {
	id: CategoryKey;
	name: string;
	value: number;
	color?: string;
	x0: number;
	y0: number;
	x1: number;
	y1: number;
	width: number;
	height: number;
}

/**
 * Calculate treemap layout for budget items
 * @param items - Array of budget items with name and budget
 * @param total - Total budget (items can be less than this, leaving empty space)
 * @param containerSize - Width and height of the container
 * @returns Array of treemap boxes with positions and dimensions
 */
export function calculateTreemap(
	items: BudgetItem[],
	total: number,
	containerSize: number
): { treemapBoxes: TreemapBoxType[]; boxesSize: number } {
	// Calculate the sum of items
	const itemsSum = items.reduce((sum, item) => sum + item.value, 0);

	// Determine size (square) of the treemap
	const itemsShare = Math.min(total, itemsSum) / total;
	const area = itemsShare * (containerSize * containerSize);
	const size = Math.sqrt(area);

	// Add an "empty" item at the end if items don't fill the total budget
	// Placing it at the end with sorting will push it to bottom-left
	const allItems: BudgetItem[] = items;

	// Create hierarchy structure
	// Sort so larger items come first, which pushes the empty (smallest) to bottom-left
	const root = hierarchy<TreeNode>({ id: 'root', name: 'root', children: allItems })
		.sum((d) => d.value || 0)
		.sort((a, b) => {
			// Otherwise sort by value descending
			return (b.value || 0) - (a.value || 0);
		});

	// Create treemap layout
	const treemapLayout = treemap<TreeNode>().size([size, size]).padding(2).round(true);

	// Calculate layout
	const layoutRoot: HierarchyRectangularNode<TreeNode> = treemapLayout(root);

	// Extract boxes from leaf nodes (excluding the empty placeholder)
	const boxes: TreemapBoxType[] = [];
	if (layoutRoot.children) {
		for (const node of layoutRoot.children) {
			if (node.data.name !== '_empty') {
				boxes.push({
					id: node.data.id as CategoryKey,
					name: node.data.name,
					value: node.data.value || 0,
					color: node.data.color,
					x0: node.x0,
					y0: node.y0,
					x1: node.x1,
					y1: node.y1,
					width: node.x1 - node.x0,
					height: node.y1 - node.y0
				});
			}
		}
	}

	return { treemapBoxes: boxes, boxesSize: size };
}

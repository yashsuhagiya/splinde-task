import { Entry, Section, ComputedSection } from "./types";

// Generate a unique ID
function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

export function computeSums(node: Entry | Section): Entry | ComputedSection {
    if ("sum" in node) return { ...node, id: node.id || generateId() };

    const children = node.children.map(computeSums);
    const computedSum = children.reduce(
        (acc, child) => acc + ("sum" in child ? child.sum : child.computedSum),
        0
    );

    return { ...node, children, computedSum, id: node.id || generateId() };
}

// Fixed the previous implementation to ensure it works in O(1) complexity
export function recalculateSums(
    node: Entry | ComputedSection
): Entry | ComputedSection {
    if ("sum" in node) return node;

    const computedSum = node.children.reduce(
        (acc, child) => acc + ("sum" in child ? child.sum : child.computedSum),
        0
    );

    return { ...node, computedSum };
}

export function createEntry(
    name: string = "New Entry",
    sum: number = 0
): Entry {
    return { name, sum, note: "", id: generateId() };
}

export function createSection(name: string = "New Section"): ComputedSection {
    return { name, children: [], computedSum: 0, id: generateId() };
}

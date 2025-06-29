import { Entry, Section, ComputedSection } from "./types";

// Generate a unique ID
function generateId(): string {
    return Math.random().toString(36).substr(2, 9);
}

// Convert computed nodes back to raw format
export function toRawNode(node: Entry | ComputedSection): Entry | Section {
    if ("sum" in node) {
        // Entry node - just copy without computedSum
        return { name: node.name, sum: node.sum, note: node.note, id: node.id };
    }
    
    // Section node - recursively convert children and remove computedSum
    const rawChildren = node.children.map(toRawNode);
    return { name: node.name, children: rawChildren, id: node.id };
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

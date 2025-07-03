import { useState } from "react";
import type { Entry, ComputedSection } from "@/lib/types";
import { recalculateSums, createEntry, createSection } from "@/lib/utils";
import {
    FaChevronDown,
    FaChevronRight,
    FaPlus,
    FaTrash,
    FaFolderPlus,
} from "react-icons/fa";
import toast from "react-hot-toast";

type Props = {
    node: Entry | ComputedSection;
    onUpdate: (updatedNode: Entry | ComputedSection) => void;
    onDelete?: () => void;
    level?: number;
};

export function TreeNode({ node, onUpdate, onDelete, level = 0 }: Props) {
    const [localSum, setLocalSum] = useState(
        "sum" in node ? node.sum.toString() : ""
    );
    const [localNote, setLocalNote] = useState("note" in node ? node.note : "");
    const [localName, setLocalName] = useState(node.name);
    const [collapsed, setCollapsed] = useState(false);

    const indent = level * 20;

    const handleChildUpdate = (
        childIndex: number,
        updatedChild: Entry | ComputedSection
    ) => {
        if ("children" in node) {
            const updatedChildren = [...node.children];
            updatedChildren[childIndex] = updatedChild;
            const updatedNode = { ...node, children: updatedChildren };
            // Recalculate only this node's sum based on its children
            const recalculatedNode = recalculateSums(updatedNode);
            onUpdate(recalculatedNode);
        }
    };

    const handleAddEntry = () => {
        if ("children" in node) {
            const newEntry = createEntry();
            const updatedChildren = [...node.children, newEntry];
            const updatedNode = { ...node, children: updatedChildren };
            const recalculatedNode = recalculateSums(updatedNode);
            onUpdate(recalculatedNode);
            toast.success("Entry added");
        }
    };

    const handleAddSection = () => {
        if ("children" in node) {
            const newSection = createSection();
            const updatedChildren = [...node.children, newSection];
            const updatedNode = { ...node, children: updatedChildren };
            const recalculatedNode = recalculateSums(updatedNode);
            onUpdate(recalculatedNode);
            toast.success("Section added");
        }
    };

    const handleDeleteChild = (childId: string) => {
        if ("children" in node) {
            const updatedChildren = node.children.filter(
                (child) => child.id !== childId
            );
            const updatedNode = { ...node, children: updatedChildren };
            const recalculatedNode = recalculateSums(updatedNode);
            onUpdate(recalculatedNode);
            toast.success("Item deleted");
        }
    };

    // Entry node (leaf)
    if ("sum" in node) {
        return (
            <div
                className="relative group mb-2"
                style={{ marginLeft: Math.min(indent, 40) }}
            >
                <div className="bg-white border border-gray-200 shadow-sm rounded p-3">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                            <input
                                className="font-medium text-gray-800 bg-transparent border-none focus:outline-none focus:bg-gray-50 focus:px-2 focus:py-1 focus:rounded flex-1 min-w-0"
                                value={localName}
                                onChange={(e) => setLocalName(e.target.value)}
                                onBlur={() => {
                                    const updatedNode = { ...node, name: localName };
                                    onUpdate(updatedNode);
                                }}
                            />
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <input
                                    className="border border-gray-300 rounded px-2 py-1 w-16 sm:w-20 text-right text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                                    type="number"
                                    value={localSum}
                                    onChange={(e) => setLocalSum(e.target.value)}
                                    onBlur={() => {
                                        const updatedNode = {
                                            ...node,
                                            sum: parseFloat(localSum),
                                        };
                                        onUpdate(updatedNode);
                                    }}
                                />
                                {onDelete && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete();
                                        }}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded flex-shrink-0"
                                        title="Delete entry"
                                    >
                                        <FaTrash size={10} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <textarea
                            className="border border-gray-300 rounded px-3 py-2 w-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            value={localNote}
                            placeholder="Note..."
                            rows={2}
                            onChange={(e) => setLocalNote(e.target.value)}
                            onBlur={() => {
                                const updatedNode = { ...node, note: localNote };
                                onUpdate(updatedNode);
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Section node
    const hasChildren = node.children && node.children.length > 0;
    const sumCalculated = node.computedSum || 0;
    return (
        <div
            className="relative group mb-2"
            style={{ marginLeft: Math.min(indent, 40) }}
        >
            <div className="bg-gray-50 border border-gray-200 shadow-inner rounded p-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        {hasChildren ? (
                            <button
                                className="text-blue-600 hover:bg-blue-50 p-1 rounded flex-shrink-0"
                                onClick={() => setCollapsed(!collapsed)}
                                aria-label={collapsed ? "Expand" : "Collapse"}
                            >
                                {collapsed ? (
                                    <FaChevronRight size={10} />
                                ) : (
                                    <FaChevronDown size={10} />
                                )}
                            </button>
                        ) : (
                            <span className="w-3 flex-shrink-0" />
                        )}
                        <input
                            className={`"font-semibold text-gray-800 ${sumCalculated > 300 ? "bg-red-100" : "bg-transparent"} border-none focus:outline-none focus:bg-gray-50 focus:px-2 focus:py-1 focus:rounded flex-1 min-w-0 text-sm sm:text-base`}
                            value={localName}
                            onChange={(e) => setLocalName(e.target.value)}
                            onBlur={() => {
                                const updatedNode = { ...node, name: localName };
                                onUpdate(updatedNode);
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <span className="text-xs sm:text-sm text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
                            Sum: {node.computedSum}
                        </span>
                        <div className="flex gap-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddEntry();
                                }}
                                className="text-green-600 hover:bg-green-50 p-1.5 rounded"
                                title="Add entry"
                            >
                                <FaPlus size={10} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddSection();
                                }}
                                className="text-blue-600 hover:bg-blue-50 p-1.5 rounded"
                                title="Add section"
                            >
                                <FaFolderPlus size={10} />
                            </button>
                            {onDelete && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete();
                                    }}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded"
                                    title="Delete section"
                                >
                                    <FaTrash size={10} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {!collapsed && hasChildren && (
                    <div className="mt-3">
                        {node.children.map((child, i) => (
                            <TreeNode
                                key={child.id || i}
                                node={child}
                                onUpdate={(updatedChild) =>
                                    handleChildUpdate(i, updatedChild)
                                }
                                onDelete={() => {
                                    handleDeleteChild(child.id || `temp-${i}`);
                                }}
                                level={level + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

import { useState } from "react";
import type { Entry, ComputedSection } from "@/lib/types";
import { FaChevronDown, FaChevronRight, FaPlus, FaTrash, FaFolderPlus } from "react-icons/fa";
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

    const handleChildUpdate = (childIndex: number, updatedChild: Entry | ComputedSection) => {
        if ("children" in node) {
            const updatedChildren = [...node.children];
            updatedChildren[childIndex] = updatedChild;
            const updatedNode = { ...node, children: updatedChildren };
            onUpdate(updatedNode);
        }
    };

    const handleAddEntry = () => {
        if ("children" in node) {
            const newEntry: Entry = {
                name: "New Entry",
                sum: 0,
                note: "",
                id: Math.random().toString(36).substr(2, 9)
            };
            const updatedChildren = [...node.children, newEntry];
            const updatedNode = { ...node, children: updatedChildren };
            onUpdate(updatedNode);
        }
    };

    const handleAddSection = () => {
        if ("children" in node) {
            const newSection: ComputedSection = {
                name: "New Section",
                children: [],
                computedSum: 0,
                id: Math.random().toString(36).substr(2, 9)
            };
            const updatedChildren = [...node.children, newSection];
            const updatedNode = { ...node, children: updatedChildren };
            onUpdate(updatedNode);
        }
    };

    const handleDeleteChild = (childId: string) => {
        if ("children" in node) {
            const updatedChildren = node.children.filter((child) => child.id !== childId);
            const updatedNode = { ...node, children: updatedChildren };
            onUpdate(updatedNode);
        }
    };

    // Entry node (leaf)
    if ("sum" in node) {
        return (
            <div className="relative group mb-3" style={{ marginLeft: indent }}>
                <div className="bg-white border border-gray-200 shadow-sm rounded p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <input
                            className="font-medium text-gray-800 bg-transparent border-none focus:outline-none focus:bg-gray-50 focus:px-2 focus:py-1 focus:rounded"
                            value={localName}
                            onChange={(e) => setLocalName(e.target.value)}
                            onBlur={() => {
                                const updatedNode = { ...node, name: localName };
                                onUpdate(updatedNode);
                            }}
                        />
                        <div className="flex items-center gap-2">
                            <input
                                className="border border-gray-300 rounded px-2 py-1 w-24 text-right text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                type="number"
                                value={localSum}
                                onChange={(e) => setLocalSum(e.target.value)}
                                onBlur={() => {
                                    const updatedNode = { ...node, sum: parseFloat(localSum) };
                                    onUpdate(updatedNode);
                                }}
                            />
                            {onDelete && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete();
                                    }}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded"
                                    title="Delete entry"
                                >
                                    <FaTrash size={12} />
                                </button>
                            )}
                        </div>
                    </div>
                    <textarea
                        className="mt-2 border border-gray-300 rounded px-3 py-2 w-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        value={localNote}
                        placeholder="Note..."
                        onChange={(e) => setLocalNote(e.target.value)}
                        onBlur={() => {
                            const updatedNode = { ...node, note: localNote };
                            onUpdate(updatedNode);
                        }}
                    />
                </div>
            </div>
        );
    }

    // Section node
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="relative group mb-3" style={{ marginLeft: indent }}>
            <div className="bg-gray-50 border border-gray-200 shadow-inner rounded p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {hasChildren ? (
                            <button
                                className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                                onClick={() => setCollapsed(!collapsed)}
                                aria-label={collapsed ? "Expand" : "Collapse"}
                            >
                                {collapsed ? <FaChevronRight /> : <FaChevronDown />}
                            </button>
                        ) : (
                            <span className="w-5" />
                        )}
                        <input
                            className="font-semibold text-gray-800 bg-transparent border-none focus:outline-none focus:bg-gray-50 focus:px-2 focus:py-1 focus:rounded"
                            value={localName}
                            onChange={(e) => setLocalName(e.target.value)}
                            onBlur={() => {
                                const updatedNode = { ...node, name: localName };
                                onUpdate(updatedNode);
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200">
                            Sum: {node.computedSum}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddEntry();
                                    toast.success("Entry added!");
                                }}
                                className="text-green-600 hover:bg-green-50 p-2 rounded"
                                title="Add entry"
                            >
                                <FaPlus size={12} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddSection();
                                    toast.success("Section added!");
                                }}
                                className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                                title="Add section"
                            >
                                <FaFolderPlus size={12} />
                            </button>
                            {onDelete && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete();
                                    }}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded"
                                    title="Delete section"
                                >
                                    <FaTrash size={12} />
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
                                onUpdate={(updatedChild) => handleChildUpdate(i, updatedChild)}
                                onDelete={() => {
                                    handleDeleteChild(child.id || `temp-${i}`);
                                    toast.success("Item deleted!");
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

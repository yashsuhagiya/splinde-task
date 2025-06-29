"use client";
import { TreeNode } from "@/components/TreeNode";
import { ComputedSection, Entry } from "@/lib/types";
import { computeSums, toRawNode } from "@/lib/utils";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type ComputedRoot = ComputedSection | Entry;

export default function Home() {
  const [data, setData] = useState<ComputedRoot | null>(null);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((json) => {
        setData(computeSums(json));
      });
  }, []);

  const handleUpdate = (updatedNode: ComputedRoot) => {
    // Convert back to raw format and recompute sums
    const rawNode = toRawNode(updatedNode);
    setData(computeSums(rawNode));
  };

  if (!data)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 text-lg text-gray-600">
        Loading...
      </div>
    );

  const totalSum = "computedSum" in data ? data.computedSum : data.sum;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900">{data.name}</h1>
        <p className="text-sm text-gray-500 mt-1">
          View and edit sections, values, and notes.
        </p>
      </div>

      <div className="flex items-baseline gap-3 mb-8">
        <h2 className="text-xl font-semibold text-blue-700">Total Sum:</h2>
        <span className="text-xl font-bold text-gray-800">{totalSum}</span>
      </div>

      <div className="w-full bg-white border border-gray-200 shadow-xl rounded-2xl p-6">
        <div className="max-h-[70vh] overflow-auto">
          <TreeNode
            node={data}
            onUpdate={handleUpdate}
            onDelete={() => {
              // For root node, we could reset to empty data or show a confirmation
              // For now, let's not allow deleting the root node
              toast.error("Cannot delete the root node");
            }}
          />
        </div>
      </div>
    </div>
  );
}

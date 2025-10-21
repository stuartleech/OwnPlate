"use client";

import { useEffect, useState } from "react";

type PantryItem = {
  id: number;
  ingredientId: number;
  ingredientName: string;
  status: "have" | "low" | "out";
};

type Ingredient = {
  id: number;
  name: string;
  is_staple: boolean;
};

export default function PantryPage() {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [allStaples, setAllStaples] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchPantry();
  }, []);

  const fetchPantry = async () => {
    try {
      const [pantryRes, staplesRes] = await Promise.all([
        fetch("/api/pantry"),
        fetch("/api/pantry/staples"),
      ]);

      const pantryData = await pantryRes.json();
      const staplesData = await staplesRes.json();

      setPantryItems(pantryData.pantry || []);
      setAllStaples(staplesData.staples || []);
    } catch (error) {
      console.error("Failed to fetch pantry:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (ingredientId: number, status: "have" | "low" | "out") => {
    setUpdating(true);
    try {
      const response = await fetch("/api/pantry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientId, status }),
      });

      if (response.ok) {
        await fetchPantry();
      }
    } catch (error) {
      console.error("Failed to update pantry:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusForIngredient = (ingredientId: number) => {
    const item = pantryItems.find(i => i.ingredientId === ingredientId);
    return item?.status || "out";
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">Loading pantry...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Pantry</h1>
        <p className="text-gray-600 mt-2">Track your staple ingredients</p>
      </div>

      {allStaples.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">🥫</div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-900">No staples yet</h2>
          <p className="text-gray-600 mb-6">
            Add recipes with staple ingredients first, then they'll appear here
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="grid gap-4">
              {allStaples.map((staple) => {
                const currentStatus = getStatusForIngredient(staple.id);
                
                return (
                  <div key={staple.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🥫</span>
                      <span className="font-medium text-lg">{staple.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(staple.id, "have")}
                        disabled={updating}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          currentStatus === "have"
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        ✓ Have
                      </button>
                      <button
                        onClick={() => updateStatus(staple.id, "low")}
                        disabled={updating}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          currentStatus === "low"
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        ⚠ Low
                      </button>
                      <button
                        onClick={() => updateStatus(staple.id, "out")}
                        disabled={updating}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          currentStatus === "out"
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        ✕ Out
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Tip</h3>
        <p className="text-sm text-blue-800">
          When planning your weekly meals, recipes that use staples you "Have" will be highlighted, 
          helping you use up what you've already got and reduce waste!
        </p>
      </div>
    </div>
  );
}


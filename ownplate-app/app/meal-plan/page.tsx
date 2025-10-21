"use client";

import { useEffect, useState } from "react";

type Recipe = {
  id: number;
  name: string;
  servings: number;
  usesStaples: boolean;
  ingredientCount: number;
};

type SelectedRecipe = {
  recipeId: number;
  recipeName: string;
  dayOfWeek: number;
};

type ShoppingItem = {
  ingredientName: string;
  totalQuantity: number;
  unit: string;
  isStaple: boolean;
  needToBuy: boolean;
};

export default function MealPlanPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipe[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [weekStartDate, setWeekStartDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    // Set to next Monday
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilMonday);
    setWeekStartDate(nextMonday.toISOString().split("T")[0]);

    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch("/api/meal-plan/recipes");
      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectRecipe = (recipeId: number, recipeName: string, dayOfWeek: number) => {
    // Remove any existing selection for this day
    const filtered = selectedRecipes.filter(r => r.dayOfWeek !== dayOfWeek);
    setSelectedRecipes([...filtered, { recipeId, recipeName, dayOfWeek }]);
  };

  const removeRecipe = (dayOfWeek: number) => {
    setSelectedRecipes(selectedRecipes.filter(r => r.dayOfWeek !== dayOfWeek));
  };

  const getRecipeForDay = (dayOfWeek: number) => {
    return selectedRecipes.find(r => r.dayOfWeek === dayOfWeek);
  };

  const generateShoppingList = async () => {
    if (selectedRecipes.length === 0) {
      return;
    }

    try {
      const response = await fetch("/api/meal-plan/shopping-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeIds: selectedRecipes.map(r => r.recipeId),
        }),
      });

      const data = await response.json();
      setShoppingList(data.shoppingList || []);
    } catch (error) {
      console.error("Failed to generate shopping list:", error);
    }
  };

  const saveMealPlan = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekStartDate,
          meals: selectedRecipes,
        }),
      });

      if (response.ok) {
        alert("Meal plan saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save meal plan:", error);
      alert("Failed to save meal plan");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (selectedRecipes.length > 0) {
      generateShoppingList();
    } else {
      setShoppingList([]);
    }
  }, [selectedRecipes]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  const freshItems = shoppingList.filter(item => !item.isStaple);
  const staplesToBuy = shoppingList.filter(item => item.isStaple && item.needToBuy);
  const staplesYouHave = shoppingList.filter(item => item.isStaple && !item.needToBuy);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Weekly Meal Plan</h1>
        <p className="text-gray-600 mt-2">Select 5 dinners for the week</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left column - Recipe selection */}
        <div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Week Starting
            </label>
            <input
              type="date"
              value={weekStartDate}
              onChange={(e) => setWeekStartDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div className="space-y-4">
            {days.map((day, index) => {
              const selectedRecipe = getRecipeForDay(index);

              return (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{day}</h3>
                    {selectedRecipe && (
                      <button
                        onClick={() => removeRecipe(index)}
                        className="text-red-600 hover:text-red-700 text-sm font-semibold"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {selectedRecipe ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="font-medium text-green-900">{selectedRecipe.recipeName}</p>
                    </div>
                  ) : (
                    <select
                      onChange={(e) => {
                        const recipeId = parseInt(e.target.value);
                        const recipe = recipes.find(r => r.id === recipeId);
                        if (recipe) {
                          selectRecipe(recipe.id, recipe.name, index);
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                    >
                      <option value="">Select a recipe...</option>
                      {recipes.map((recipe) => (
                        <option key={recipe.id} value={recipe.id}>
                          {recipe.name}
                          {recipe.usesStaples ? " ✓" : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              );
            })}
          </div>

          {selectedRecipes.length === 5 && (
            <button
              onClick={saveMealPlan}
              disabled={saving}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Meal Plan"}
            </button>
          )}
        </div>

        {/* Right column - Shopping list */}
        <div>
          <div className="bg-white rounded-lg shadow p-6 sticky top-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Shopping List</h2>

            {shoppingList.length === 0 ? (
              <p className="text-gray-500 italic">Select recipes to see your shopping list</p>
            ) : (
              <div className="space-y-6">
                {/* Fresh Ingredients */}
                {freshItems.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-green-700">🥬 Fresh Ingredients</h3>
                    <ul className="space-y-2">
                      {freshItems.map((item, index) => (
                        <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span>{item.ingredientName}</span>
                          <span className="text-gray-600 font-medium">
                            {item.totalQuantity} {item.unit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Staples to Buy */}
                {staplesToBuy.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-yellow-700">🛒 Staples to Buy</h3>
                    <ul className="space-y-2">
                      {staplesToBuy.map((item, index) => (
                        <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span>{item.ingredientName}</span>
                          <span className="text-gray-600 font-medium">
                            {item.totalQuantity} {item.unit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Staples You Have */}
                {staplesYouHave.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-600">✓ Staples You Have</h3>
                    <ul className="space-y-2">
                      {staplesYouHave.map((item, index) => (
                        <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100 opacity-60">
                          <span>{item.ingredientName}</span>
                          <span className="text-gray-600 font-medium">
                            {item.totalQuantity} {item.unit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t-2 border-gray-300">
                  <button
                    onClick={() => window.print()}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-lg transition"
                  >
                    🖨️ Print List
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


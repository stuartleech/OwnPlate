"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";

type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
  isStaple: boolean;
};

export default function NewRecipePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"form" | "csv">("form");
  
  // Form state
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [servings, setServings] = useState(2);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", quantity: 0, unit: "", isStaple: false },
  ]);
  
  // CSV state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvError, setCsvError] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: 0, unit: "", isStaple: false }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: any) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          instructions,
          servings,
          ingredients: ingredients.filter(i => i.name.trim() !== ""),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to create recipe");
        setLoading(false);
        return;
      }

      router.push("/recipes");
      router.refresh();
    } catch (error) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleCSVUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!csvFile) {
      setCsvError("Please select a CSV file");
      return;
    }

    setCsvError("");
    setLoading(true);

    Papa.parse(csvFile, {
      header: true,
      complete: async (results) => {
        try {
          const response = await fetch("/api/recipes/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipes: results.data }),
          });

          if (!response.ok) {
            const data = await response.json();
            setCsvError(data.error || "Failed to import recipes");
            setLoading(false);
            return;
          }

          router.push("/recipes");
          router.refresh();
        } catch (error) {
          setCsvError("An error occurred. Please try again.");
          setLoading(false);
        }
      },
      error: (error) => {
        setCsvError(`CSV parsing error: ${error.message}`);
        setLoading(false);
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Recipe</h1>
        <p className="text-gray-600 mt-2">Create a recipe manually or import from CSV</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("form")}
              className={`flex-1 py-4 px-6 text-center font-semibold ${
                activeTab === "form"
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Manual Entry
            </button>
            <button
              onClick={() => setActiveTab("csv")}
              className={`flex-1 py-4 px-6 text-center font-semibold ${
                activeTab === "csv"
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Import CSV
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "form" ? (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  placeholder="e.g., Vegetarian Stir Fry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servings
                </label>
                <input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(parseInt(e.target.value))}
                  min="1"
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingredients *
                </label>
                <div className="space-y-3">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <input
                        type="text"
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(index, "name", e.target.value)}
                        placeholder="Ingredient name"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                      />
                      <input
                        type="number"
                        value={ingredient.quantity || ""}
                        onChange={(e) => updateIngredient(index, "quantity", parseFloat(e.target.value))}
                        placeholder="Qty"
                        step="0.01"
                        className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                      />
                      <input
                        type="text"
                        value={ingredient.unit}
                        onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                        placeholder="Unit"
                        className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                      />
                      <label className="flex items-center gap-2 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={ingredient.isStaple}
                          onChange={(e) => updateIngredient(index, "isStaple", e.target.checked)}
                          className="rounded text-green-600"
                        />
                        <span className="text-sm">Staple</span>
                      </label>
                      {ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="mt-3 text-green-600 hover:text-green-700 font-semibold text-sm"
                >
                  + Add Ingredient
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  placeholder="Step-by-step cooking instructions..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Recipe"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/recipes")}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCSVUpload} className="space-y-6">
              {csvError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {csvError}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">CSV Format</h3>
                <p className="text-sm text-blue-800 mb-2">Your CSV should have the following columns:</p>
                <code className="block bg-white p-2 rounded text-xs">
                  recipe_name, ingredient_name, quantity, unit, is_staple, instructions, servings
                </code>
                <p className="text-xs text-blue-700 mt-2">
                  Each row should represent one ingredient. Group rows by recipe_name. 
                  is_staple should be "true" or "false".
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading || !csvFile}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? "Importing..." : "Import Recipes"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/recipes")}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


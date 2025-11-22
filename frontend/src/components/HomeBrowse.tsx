'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Navigation } from "./Navigation";
import { Search, ChefHat } from "lucide-react";
import { cuisineTypes, dietaryFilters, timeFilters } from "../data/recipes";
import type { ApiRecipe, UiRecipe } from "@/src/types/recipe";
import { RecipeCard } from "./RecipeCard";
import { useSession } from "../context/CsrfContext";
import Link from "next/link";

interface User {
    id: string;
    displayName: string;
    email: string;
}

interface HomeBrowseProps {
    recipes: ApiRecipe[] | null;
    user?: User | null;

    onProfile?: () => void;
    onCreateRecipe?: () => void;
    onRecipeClick?: (recipeId: string) => void;
    onSignOut?: () => void;

    onBack?: () => void;
    onSignIn?: () => void;
    onSignUp?: () => void;
}

const normalizeRecipe = (r: ApiRecipe): UiRecipe => {
    const author =
        typeof r.ownerUsername === "string"
            ? r.ownerUsername
            : r?.ownerUsername?.name ?? "Unknown";

    // const dietaryTags = (r.tag ?? "")
    //     .split("_")
    //     .map(t => t.trim())
    //     .filter(Boolean)
    //     .map(t => t[0] + t.slice(1).toLowerCase());

    return {
        commentCount: 0, comments: [], ingredients: [], // subject to change
        id: String(r.recipeID),
        title: r.title,
        description: r.description ?? "",
        imageUrl: r.imageUrl ?? "/placeholder.png",
        cuisine: "Other",
        dietaryTags : r.tag ?? [] ,
        prepTime: r.prepTime ?? 0,
        cookTime: r.cookTime ?? 0,
        servings: r.servings ?? 1,
        upvotes: r.upvotes ?? 0,
        bookmarkCount: 0,
        difficulty: r.difficulty ?? 1,
        author,
        instructions: r.steps ? r.steps.split("\n").filter(s => s.trim() !== "") : [],
    };
};

export function HomeBrowse({
                               recipes = [],
                               onProfile,
                               onCreateRecipe,
                               onRecipeClick,
                               onSignOut,
                               onBack,
                               onSignIn,
                               onSignUp,
                           }: HomeBrowseProps) {
    const router = useRouter();
    const go = (path: string) => router.push(path as Route);

    const {user, loading} = useSession();

    const allRecipes: UiRecipe[] = useMemo(
        () => (recipes ?? []).map(normalizeRecipe),
        [recipes]
    );

    const handleRecipeClick = (id: string) =>
        onRecipeClick ? onRecipeClick(id) : go(`/recipes/${id}`);
    const handleProfile = () => (onProfile ? onProfile() : go("/me"));
    const handleCreate = () => (onCreateRecipe ? onCreateRecipe() : go("/create"));
    const handleSignOut = () => (onSignOut ? onSignOut() : go("/logout"));

    const handleBack = () => (onBack ? onBack() : go("/"));
    const handleSignIn = () => (onSignIn ? onSignIn() : go("/sign-in"));
    const handleSignUp = () => (onSignUp ? onSignUp() : go("/sign-up"));

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCuisine, setSelectedCuisine] = useState("All");
    const [selectedDiet, setSelectedDiet] = useState("All");
    const [selectedTime, setSelectedTime] = useState("All");

    const filteredRecipes = useMemo(
        () =>
            allRecipes.filter((recipe) => {
                const q = searchQuery.toLowerCase();
                const matchesSearch = !q ||
                    recipe.title.toLowerCase().includes(q) ||
                    recipe.description.toLowerCase().includes(q);

                const matchesCuisine =
                    selectedCuisine === "All" || recipe.cuisine === selectedCuisine;

                const matchesDiet =
                    selectedDiet === "All" || recipe.dietaryTags.includes(selectedDiet);

                const totalTime = recipe.prepTime + recipe.cookTime;
                const matchesTime =
                    selectedTime === "All" ||
                    (selectedTime === "Under 30 min" && totalTime < 30) ||
                    (selectedTime === "30-60 min" && totalTime >= 30 && totalTime <= 60) ||
                    (selectedTime === "1-2 hours" && totalTime > 60 && totalTime <= 120) ||
                    (selectedTime === "2+ hours" && totalTime > 120);

                return matchesSearch && matchesCuisine && matchesDiet && matchesTime;
            }),
        [allRecipes, searchQuery, selectedCuisine, selectedDiet, selectedTime]
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation
            />

            {/* Guest Notice (only when no user) */}
            {!user && !loading && (
                <div className="container mx-auto px-4 mt-8">
                    <div className="bg-orange-100 border border-orange-200 rounded-lg p-4 mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <ChefHat className="h-5 w-5 text-orange-600" />
                                <div>
                                    <p className="font-medium text-orange-800">Browsing as Guest</p>
                                    <p className="text-sm text-orange-600">
                                        Sign in to bookmark recipes, upvote, and leave comments.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleBack}>Back to Home</Button>
                                <Button variant="outline" onClick={handleSignIn}>Sign In</Button>
                                <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSignUp}>
                                    Sign Up
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold">
                                {user ? `Welcome back, ${user.username}!` : "Browse Recipes"}
                            </h1>
                            <p className="text-gray-600">
                                {user
                                    ? "Discover new recipes and manage your collection."
                                    : "Discover new recipes from the community!"}
                            </p>
                        </div>

                        {user && (
                            <Button onClick={handleCreate} className="bg-orange-500 hover:bg-orange-600">
                                Create New Recipe
                            </Button>
                        )}
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Find Recipes</h2>

                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Search recipes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Cuisine</label>
                            <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                                <SelectTrigger><SelectValue placeholder="Select cuisine" /></SelectTrigger>
                                <SelectContent>
                                    {cuisineTypes.map((cuisine) => (
                                        <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Diet</label>
                            <Select value={selectedDiet} onValueChange={setSelectedDiet}>
                                <SelectTrigger><SelectValue placeholder="Select diet" /></SelectTrigger>
                                <SelectContent>
                                    {dietaryFilters.map((diet) => (
                                        <SelectItem key={diet} value={diet}>{diet}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Time</label>
                            <Select value={selectedTime} onValueChange={setSelectedTime}>
                                <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                                <SelectContent>
                                    {timeFilters.map((time) => (
                                        <SelectItem key={time} value={time}>{time}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="mb-4">
                    <p className="text-gray-600">
                        {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? "s" : ""} found
                    </p>
                </div>

                {/* Recipe Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecipes.map((r) => (
                        <Link key={r.id} href={`/recipes/${r.id}` as Route}>
                        <RecipeCard
                            key={r.id}
                            recipe={r}
                            onBookmark={(id: string) => {
                                console.log("bookmark", id);
                            }}
                            isAuthed={!!user}
                            onRequireAuth={() => (onSignIn?.() ?? go("/sign-in"))}
                        />
                    </Link> 
                    ))}
                </div>

                {/* Empty state */}
                {filteredRecipes.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">No recipes found matching your criteria.</p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCuisine("All");
                                setSelectedDiet("All");
                                setSelectedTime("All");
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

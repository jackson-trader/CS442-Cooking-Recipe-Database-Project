'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Navigation } from "./Navigation";
import { Search, ChefHat } from "lucide-react";
import { timeFilters } from "../data/recipes";
import type {ApiRecipe, UiComment, UiRecipe} from "@/src/types/recipe";
import { RecipeCard } from "./RecipeCard";
import { useSession } from "../context/CsrfContext";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

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

const TAG_OPTIONS = [
    { value: "All",          label: "All"          },
    { value: "VEGAN",        label: "Vegan"        },
    { value: "VEGETARIAN",   label: "Vegetarian"   },
    { value: "GLUTEN_FREE",  label: "Gluten Free"  },
    { value: "DAIRY_FREE",   label: "Dairy Free"   },
    { value: "KETO",         label: "Keto"         },
    { value: "PALEO",        label: "Paleo"        },
    { value: "LOW_CARB",     label: "Low Carb"     },
    { value: "HIGH_PROTEIN", label: "High Protein" },
    { value: "QUICK_EASY",   label: "Quick & Easy" },
    { value: "DESSERT",      label: "Dessert"      },
    { value: "APPETIZER",    label: "Appetizer"    },

];

const getAuthor = (r: ApiRecipe): string => {

    const fromOwner =
        r.owner?.username && r.owner.username.trim().length > 0
            ? r.owner.username
            : undefined;


    const fromAuthorField =
        r.author && r.author.trim().length > 0 ? r.author : undefined;


    const fromOwnerUsername =
        typeof r.ownerUsername === "string"
            ? r.ownerUsername
            : r.ownerUsername?.name;

    return fromOwner || fromAuthorField || fromOwnerUsername || "Unknown";
};


const normalizeRecipe = (r: ApiRecipe): UiRecipe => {
    const comments: UiComment[] = (r.comments ?? []).map((c) => ({
        id: String(c.id ?? c.commentID),          // support both
        content: c.text ?? c.content ?? "",       // new then old
        author:
            c.commenterUsername ??
            r.owner?.username ??
            "Unknown",
    }));

    return {
        id: String(r.recipeID),
        title: r.title,
        description: r.description ?? "",
        imageUrl: r.imageUrl ?? "/placeholder.png",
        dietaryTags: r.tags ?? [],
        prepTime: r.prepTime ?? 0,
        cookTime: r.cookTime ?? 0,
        servings: r.servings ?? 1,
        upvotes: r.upvotes ?? 0,
        bookmarkCount: 0,
        author: getAuthor(r),
        ingredients: r.ingredients ?? [],
        comments,
        commentCount: comments.length,
        instructions: r.steps
            ? r.steps.split("\n").filter((s) => s.trim() !== "")
            : [],
        difficulty: r.difficulty ?? 1,
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

    const { user, loading } = useSession();

    const baseRecipes: UiRecipe[] = useMemo(
        () => (recipes ?? []).map(normalizeRecipe),
        [recipes]
    );

    const handleRecipeClick = (id: string) =>
        onRecipeClick ? onRecipeClick(id) : go(`/recipes/${id}`);
    const handleCreate = () => (onCreateRecipe ? onCreateRecipe() : go("/create"));
    const handleBack = () => (onBack ? onBack() : go("/"));
    const handleSignIn = () => (onSignIn ? onSignIn() : go("/sign-in"));
    const handleSignUp = () => (onSignUp ? onSignUp() : go("/sign-up"));

    const [searchQuery, setSearchQuery] = useState("");
    const [searchMode, setSearchMode] = useState<"recipe" | "user">("recipe");
    const [selectedDiet, setSelectedDiet] = useState<string>("All");
    const [selectedTime, setSelectedTime] = useState("All");


    const [tagRecipes, setTagRecipes] = useState<UiRecipe[] | null>(null);
    const [tagLoading, setTagLoading] = useState(false);
    const [tagError, setTagError] = useState<string | null>(null);

    useEffect(() => {
        if (selectedDiet === "All") {
            setTagRecipes(null);
            setTagError(null);
            return;
        }

        (async () => {
            try {
                setTagLoading(true);
                setTagError(null);

                const url = `${API_BASE}/api/recipes/tags?tags=${encodeURIComponent(selectedDiet)}`;
                const res = await fetch(url, { credentials: "include" });

                if (!res.ok) {
                    console.error("Tag filter request failed", res.status);
                    setTagError(`Failed to filter by tag (${res.status})`);
                    setTagRecipes(null);
                    return;
                }

                const data: ApiRecipe[] = await res.json();
                setTagRecipes(data.map(normalizeRecipe));
            } catch (err) {
                console.error("Error fetching tag-filtered recipes", err);
                setTagError("Error talking to server");
                setTagRecipes(null);
            } finally {
                setTagLoading(false);
            }
        })();
    }, [selectedDiet]);

    const recipesToFilter = tagRecipes ?? baseRecipes;

    const filteredRecipes = useMemo(
        () =>
            recipesToFilter.filter((recipe) => {
                const q = searchQuery.toLowerCase();

                const matchesSearch = (() => {
                    if (!q) return true;

                    if (searchMode === "recipe") {
                        return (
                            recipe.title.toLowerCase().includes(q) ||
                            recipe.description.toLowerCase().includes(q)
                        );
                    }

                    return recipe.author.toLowerCase().includes(q);
                })();

                const totalTime = recipe.prepTime + recipe.cookTime;
                const matchesTime =
                    selectedTime === "All" ||
                    (selectedTime === "Under 30 min" && totalTime < 30) ||
                    (selectedTime === "30-60 min" && totalTime >= 30 && totalTime <= 60) ||
                    (selectedTime === "1-2 hours" && totalTime > 60 && totalTime <= 120) ||
                    (selectedTime === "2+ hours" && totalTime > 120);

                return matchesSearch && matchesTime;
            }),
        [recipesToFilter, searchQuery, searchMode, selectedTime]
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

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
                                <Button variant="outline" onClick={handleBack}>
                                    Back to Home
                                </Button>
                                <Button variant="outline" onClick={handleSignIn}>
                                    Sign In
                                </Button>
                                <Button
                                    className="bg-orange-500 hover:bg-orange-600 text-white"
                                    onClick={handleSignUp}
                                >
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
                            <Button
                                onClick={handleCreate}
                                className="bg-orange-500 hover:bg-orange-600"
                            >
                                Create New Recipe
                            </Button>
                        )}
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Find Recipes</h2>

                    {/* Search bar + mode toggle */}
                    <div className="flex flex-col md:flex-row gap-2 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder={
                                    searchMode === "recipe"
                                        ? "Search by recipe..."
                                        : "Search by user..."
                                }
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="w-full md:w-40">
                            <Select
                                value={searchMode}
                                onValueChange={(v) => setSearchMode(v as "recipe" | "user")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Search by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="recipe">By Recipe</SelectItem>
                                    <SelectItem value="user">By User</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Tag filter (server-backed) */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Tag</label>
                            <Select value={selectedDiet} onValueChange={setSelectedDiet}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select tag" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TAG_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Time</label>
                            <Select value={selectedTime} onValueChange={setSelectedTime}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timeFilters.map((time) => (
                                        <SelectItem key={time} value={time}>
                                            {time}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {tagLoading && (
                        <p className="mt-4 text-sm text-gray-500">Loading tag results…</p>
                    )}
                    {tagError && (
                        <p className="mt-4 text-sm text-red-500">{tagError}</p>
                    )}
                </div>

                {/* Results */}
                <div className="mb-4">
                    <p className="text-gray-600">
                        {filteredRecipes.length} recipe
                        {filteredRecipes.length !== 1 ? "s" : ""} found
                    </p>
                </div>

                {/* Recipe Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecipes.map((r) => (
                        <Link key={r.id} href={`/recipes/${r.id}` as Route}>
                            <RecipeCard
                                key={r.id}
                                recipe={r}
                                isAuthed={!!user}
                                onRequireAuth={() => (onSignIn?.() ?? go("/sign-in"))}
                            />
                        </Link>
                    ))}
                </div>

                {/* Empty state */}
                {filteredRecipes.length === 0 && !tagLoading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">
                            No recipes found matching your criteria.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery("");
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

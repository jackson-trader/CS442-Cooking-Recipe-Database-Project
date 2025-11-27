"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Navigation } from "./Navigation";
import {
  Clock,
  Users,
  BookOpen,
} from "lucide-react";
import type { ApiRecipe, UiRecipe } from "@/src/types/recipe";

interface User {
  id: string;
  displayName: string;
  email: string;
}

interface MyProfileProps {
  user: User;
  onBrowse: () => void;
  onCreateRecipe: () => void;
  onRecipeClick: (recipeId: string) => void;
  onSignOut: () => void;
}

const normalizeRecipe = (r: ApiRecipe): UiRecipe => {
  const author =
      typeof r.ownerUsername === "string"
          ? r.ownerUsername
          : r?.ownerUsername?.name ?? "Unknown";

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
    difficulty: r.difficulty ?? 1,
    author,
    ingredients: r.ingredients ?? [],
    instructions: r.steps
        ? r.steps.split("\n").filter((s) => s.trim() !== "")
        : [],
    comments: [],
    commentCount: 0,
  };
};

export function MyProfile({
                            user,
                            onBrowse,
                            onCreateRecipe,
                            onRecipeClick,
                          }: MyProfileProps) {
  const [recipes, setRecipes] = useState<UiRecipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
            `http://localhost:8080/api/recipes/u/${user.displayName}`,
            {
              credentials: "include",
            }
        );

        if (!res.ok) {
          console.error("Failed to fetch user recipes", res.status);
          return;
        }

        const data: ApiRecipe[] = await res.json();
        setRecipes(data.map(normalizeRecipe));
      } catch (err) {
        console.error("Error fetching user recipes:", err);
      } finally {
        setLoadingRecipes(false);
      }
    }
    load();
  }, [user.displayName]);


  const RecipeCard = ({
                        recipe,
                        showActions = false,
                      }: {
    recipe: UiRecipe;
    showActions?: boolean;
  }) => (
      <Card className="cursor-pointer hover:shadow-lg">
        <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
          <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover"
              onClick={() => onRecipeClick(recipe.id)}
          />
        </div>

        <CardHeader className="pb-3" onClick={() => onRecipeClick(recipe.id)}>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg line-clamp-2">
              {recipe.title}
            </CardTitle>
          </div>
          <p className="text-sm text-gray-600">by {recipe.author}</p>
        </CardHeader>

        <CardContent className="pt-0" onClick={() => onRecipeClick(recipe.id)}>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {recipe.description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.prepTime + recipe.cookTime} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {recipe.dietaryTags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
  );

  return (
      <div className="min-h-screen bg-gray-50">
        <Navigation currentPage="profile" />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {user.displayName}'s Profile
                  </h1>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{recipes.length} Recipes Created</span>
                    </div>
                  </div>
                </div>
                <Button
                    onClick={onCreateRecipe}
                    className="bg-orange-500 hover:bg-orange-600"
                >
                  Create New Recipe
                </Button>
              </div>
            </div>

            {/* User Recipes List */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">My Recipes</h2>

              {loadingRecipes ? (
                  <p className="text-gray-500">Loading your recipes...</p>
              ) : recipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            showActions={true}
                        />
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No recipes created yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Share your favorite recipes with the community.
                    </p>
                    <Button
                        onClick={onCreateRecipe}
                        className="bg-orange-500 hover:bg-orange-600"
                    >
                      Create Your First Recipe
                    </Button>
                    <Button onClick={onBrowse} variant="outline" className="ml-2">
                      Browse Recipes
                    </Button>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

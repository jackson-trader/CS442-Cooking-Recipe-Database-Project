'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Navigation } from "./Navigation";
import { Search, Clock, Users, Heart, TrendingUp, ChefHat } from "lucide-react";
import { mockRecipes, cuisineTypes, dietaryFilters, timeFilters, Recipe } from "../data/recipes";

interface User {
  id: string;
  displayName: string;
  email: string;
}

interface HomeBrowseProps {
  user?: User | null;
  onProfile?: () => void;
  onCreateRecipe?: () => void;
  onRecipeClick?: (recipeId: string) => void;
  onSignOut?: () => void;

  onBack?: () => void;
  onSignIn?: () => void;
  onSignUp?: () => void;
}

export function HomeBrowse({
                             user = null,
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

  const handleRecipeClick = (id: string) =>
      onRecipeClick ? onRecipeClick(id) : go(`/recipes/${id}`);

  const handleProfile = () => (onProfile ? onProfile() : go("/profile"));
  const handleCreate = () => (onCreateRecipe ? onCreateRecipe() : go("/recipes/new"));
  const handleSignOut = () => (onSignOut ? onSignOut() : go("/logout"));

  const handleBack = () => (onBack ? onBack() : go("/"));
  const handleSignIn = () => (onSignIn ? onSignIn() : go("/sign-in"));
  const handleSignUp = () => (onSignUp ? onSignUp() : go("/sign-up"));


  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedDiet, setSelectedDiet] = useState("All");
  const [selectedTime, setSelectedTime] = useState("All");


  const filterRecipes = (recipes: Recipe[]) =>
      recipes.filter((recipe) => {
        const matchesSearch =
            recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCuisine = selectedCuisine === "All" || recipe.cuisine === selectedCuisine;

        const matchesDiet = selectedDiet === "All" || recipe.dietaryTags.includes(selectedDiet);

        const totalTime = recipe.prepTime + recipe.cookTime;
        const matchesTime =
            selectedTime === "All" ||
            (selectedTime === "Under 30 min" && totalTime < 30) ||
            (selectedTime === "30-60 min" && totalTime >= 30 && totalTime <= 60) ||
            (selectedTime === "1-2 hours" && totalTime > 60 && totalTime <= 120) ||
            (selectedTime === "2+ hours" && totalTime > 120);

        return matchesSearch && matchesCuisine && matchesDiet && matchesTime;
      });

  const filteredRecipes = filterRecipes(mockRecipes);


  return (
      <div className="min-h-screen bg-gray-50">
        <Navigation
            user={user ?? undefined}
            currentPage="home"
            onHome={handleBack}
            onProfile={handleProfile}
            onCreateRecipe={handleCreate}
            onSignOut={handleSignOut}
        />

        {/* Guest Notice (only when no user) */}
        {!user && (
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
                  {user ? `Welcome back, ${user.displayName}!` : "Browse Recipes"}
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

            {/* Search Bar */}
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

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Cuisine</label>
                <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cuisine" />
                  </SelectTrigger>
                  <SelectContent>
                    {cuisineTypes.map((cuisine) => (
                        <SelectItem key={cuisine} value={cuisine}>
                          {cuisine}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Diet</label>
                <Select value={selectedDiet} onValueChange={setSelectedDiet}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select diet" />
                  </SelectTrigger>
                  <SelectContent>
                    {dietaryFilters.map((diet) => (
                        <SelectItem key={diet} value={diet}>
                          {diet}
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
          </div>

          {/* Results */}
          <div className="mb-4">
            <p className="text-gray-600">
              {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Recipe Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
                <Card
                    key={recipe.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleRecipeClick(recipe.id)}
                >
                  <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
                    <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!user) return handleSignIn();
                            // TODO: toggle bookmark here for signed-in users
                          }}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Heart className="h-4 w-4 fill-red-400 text-red-400" />
                        <span>{recipe.bookmarkCount}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">by {recipe.author}</p>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recipe.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{recipe.prepTime + recipe.cookTime} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{recipe.servings} servings</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{recipe.upvotes}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {recipe.cuisine}
                      </Badge>
                      {recipe.dietaryTags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
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

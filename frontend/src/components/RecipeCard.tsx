import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Clock, Users, Heart, TrendingUp } from "lucide-react";
import type { UiRecipe } from "@/src/types/recipe";
import Link from "next/link";

type RecipeCardProps = {
    recipe: UiRecipe;
    onBookmark: (id: string) => void;
    isAuthed: boolean;
    onRequireAuth: () => void;
};

export function RecipeCard({ recipe, onBookmark, isAuthed, onRequireAuth }: RecipeCardProps) {
    return (
        <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
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
                            if (!isAuthed) return onRequireAuth();
                            onBookmark(recipe.id);
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
                    <Badge variant="secondary" className="text-xs">{recipe.cuisine}</Badge>
                    {recipe.dietaryTags.slice(0, 2).map((tag, idx) => (
                        <Badge key={`${recipe.id}-tag-${idx}`} variant="outline" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

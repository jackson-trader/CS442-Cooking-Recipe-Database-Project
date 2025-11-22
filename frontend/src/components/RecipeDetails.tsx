"use client"
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Navigation } from "./Navigation";
import { 
  Clock, 
  Users, 
  Star, 
  Heart, 
  TrendingUp, 
  ChefHat,
  MessageCircle,
  Send
} from "lucide-react";
import { mockRecipes, Recipe } from "../data/recipes";
import { ApiRecipe, UiRecipe } from "../types/recipe";
import { useSession } from "../context/CsrfContext";

interface User {
  id: string;
  displayName: string;
  email: string;
}

interface RecipeDetailsProps {
  recipeAPI: ApiRecipe;
}

const normalizeRecipe = (r: ApiRecipe): UiRecipe => {
    const author =
        typeof r.ownerUsername === "string"
            ? r.ownerUsername
            : r?.ownerUsername?.name ?? "Unknown";


    return {
        commentCount: 0, comments: [],
        ingredients: r.ingredients ?? [],
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
        author,
        difficulty: r.difficulty ?? 1,
        instructions: r.steps ? r.steps.split("\n").filter(s => s.trim() !== "") : [],
    };
};

export function RecipeDetails(
  {recipeAPI}: RecipeDetailsProps
) {
  const [newComment, setNewComment] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const {user} = useSession();
  
  const recipe = normalizeRecipe(recipeAPI);

  const handleUpvote = () => {
    if (!user) return;
    
    if (isUpvoted) {
      setUpvoteCount(prev => prev - 1);
      setIsUpvoted(false);
    } else {
      setUpvoteCount(prev => prev + 1);
      setIsUpvoted(true);
    }
  };

  const handleBookmark = () => {
    if (!user) return;
    setIsBookmarked(!isBookmarked);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    // TODO: ADD COMMENT ADDING HERE LATER
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    
    console.log("New comment:", newComment);
    setNewComment("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation></Navigation>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Recipe Header */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="aspect-video bg-gray-200 relative">
              <img 
                src={recipe.imageUrl!} 
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              {user && (
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button 
                    size="sm" 
                    variant={isBookmarked ? "default" : "secondary"}
                    onClick={handleBookmark}
                    className="bg-white/90 hover:bg-white text-gray-800"
                  >
                    <Heart className={`h-4 w-4 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant={isUpvoted ? "default" : "secondary"}
                    onClick={handleUpvote}
                    className="bg-white/90 hover:bg-white text-gray-800"
                  >
                    <TrendingUp className={`h-4 w-4 ${isUpvoted ? 'text-orange-500' : ''}`} />
                    <span className="ml-1">{upvoteCount}</span>
                  </Button>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <ChefHat className="h-4 w-4" />
                      <span>by {recipe.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4 fill-red-400 text-red-400" />
                      <span>{recipe.upvotes} bookmarks</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{recipe.description}</p>

              {/* Recipe Meta */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                  <div className="text-sm font-medium">Prep Time</div>
                  <div className="text-gray-600">{recipe.prepTime} min</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                  <div className="text-sm font-medium">Cook Time</div>
                  <div className="text-gray-600">{recipe.cookTime} min</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                  <div className="text-sm font-medium">Servings</div>
                  <div className="text-gray-600">{recipe.servings}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <ChefHat className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                  <div className="text-sm font-medium">Difficulty</div>
                  <div className="text-gray-600">{recipe.difficulty}</div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className="bg-orange-100 text-orange-800">{recipe.cuisine}</Badge>
                {recipe.dietaryTags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Ingredients and Instructions */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 leading-relaxed">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Comments ({recipe.comments.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <div className="flex space-x-3">
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!newComment.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600 mb-2">Sign in to leave a comment</p>
                </div>
              )}

              <div className="space-y-4">
                {recipe.comments.map(comment => (
                  <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium">{comment.author}</span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))}
                
                {recipe.comments.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
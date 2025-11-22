"use client";
import { useState } from "react";
import { Button } from "../../src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Input } from "../../src/components/ui/input";
import { Label } from "../../src/components/ui/label";
import { Textarea } from "../../src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../src/components/ui/select";
import { Badge } from "../../src/components/ui/badge";
import { Navigation } from "../../src/components/Navigation";
import { Plus, X, Save, Send } from "lucide-react";
import { cuisineTypes, dietaryFilters } from "../../src/data/recipes";
import { useSession } from "@/src/context/CsrfContext";
import { useRouter } from "next/navigation";
import { IngredientEnum, INGREDIENTS, TagEnum } from "@/src/data/enums";
import { useApi } from "@/src/lib/apiClient";

interface User {
  id: string;
  displayName: string;
  email: string;
}

interface Ingredient {
  name: string;
}

interface CreateRecipeProps {
  user: User;
  onHome: () => void;
  onProfile: () => void;
  onSignOut: () => void;
}

export default function CreateRecipe({ onHome, onProfile, onSignOut }: CreateRecipeProps) {
  const router = useRouter();
  const {user, loading} = useSession();
  const {apiFetch} = useApi();

  if(!user && !loading) {
    router.push("/");
    return null;
  }
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [selectedDietaryTags, setSelectedDietaryTags] = useState<TagEnum[]>([]);
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [ingredients, setIngredients] = useState<IngredientEnum[]>(["SUGAR"]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [imageUrl, setImageUrl] = useState("");

  const addIngredient = () => {
    setIngredients([...ingredients, "SUGAR"]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  // const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
  //   const updated = ingredients.map((ingredient, i) =>
  //     i === index ? { ...ingredient, [field]: value } : ingredient
  //   );
  //   setIngredients(updated);
  // };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = instructions.map((instruction, i) =>
      i === index ? value : instruction
    );
    setInstructions(updated);
  };

  const toggleDietaryTag = (tag: TagEnum) => {
    if (selectedDietaryTags.includes(tag)) {
      setSelectedDietaryTags(selectedDietaryTags.filter(t => t !== tag));
    } else {
      setSelectedDietaryTags([...selectedDietaryTags, tag]);
    }
  };

  const handleSaveDraft = () => {
    // in the real app, this will post to backend as a draft (if we keep it)
    console.log("Saving draft...");
    alert("Recipe saved as draft!");
  };

  const handlePublish = async () => {
    // basic validation
    if (!title || !description || ingredients.length === 0 || instructions.length === 0) {
      alert("Please fill in all required fields");
      return;
    }

const params = new URLSearchParams();
params.append("title", title);
params.append("description", description);
params.append("prepTime", prepTime);
params.append("cookTime", cookTime);
params.append("servings", servings);
params.append("difficulty", "1"); // or whatever
params.append("steps", instructions.join("\n"));
params.append("imageUrl", imageUrl);

selectedDietaryTags.forEach(tag => params.append("tags", tag));
ingredients.forEach(ing => params.append("ingredients", ing));
    const res = await apiFetch(
      `/api/recipes/create?${params.toString()}`,
    {method: "POST"})

    if (!res.ok) {
      console.error("Failed to publish recipe:", res.status);
      alert("Failed to publish recipe. Please try again.");
      return;
    }

    alert("Recipe published successfully!");
    router.push("/browse");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Recipe</h1>
            <p className="text-gray-600">Share your culinary creation with the community</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Recipe Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter recipe title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your recipe..."
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Recipe Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Recipe Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="">
                    {/* <div>
                      <Label htmlFor="cuisine">Cuisine *</Label>
                      <Select value={cuisine} onValueChange={setCuisine}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cuisine" />
                        </SelectTrigger>
                        <SelectContent>
                          {cuisineTypes.slice(1).map(cuisineType => (
                            <SelectItem key={cuisineType} value={cuisineType}>
                              {cuisineType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div> */}

                    <div>
                      <Label htmlFor="servings">Servings *</Label>
                      <Input
                        id="servings"
                        type="number"
                        value={servings}
                        onChange={(e) => setServings(e.target.value)}
                        placeholder="4"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="prepTime">Prep Time (minutes) *</Label>
                      <Input
                        id="prepTime"
                        type="number"
                        value={prepTime}
                        onChange={(e) => setPrepTime(e.target.value)}
                        placeholder="15"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="cookTime">Cook Time (minutes) *</Label>
                      <Input
                        id="cookTime"
                        type="number"
                        value={cookTime}
                        onChange={(e) => setCookTime(e.target.value)}
                        placeholder="30"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Dietary Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {dietaryFilters.slice(1).map(tag => (
                        <Badge
                          key={tag}
                          variant={selectedDietaryTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleDietaryTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ingredients */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Ingredients *</CardTitle>
                    <Button size="sm" onClick={addIngredient}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Ingredient
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                          {ingredients.map((ingredient, index) => (
                      <div key={index} className="flex space-x-2 items-end">
                        <div className="flex-1">
                          <Select
                            value={ingredient}
                            onValueChange={(value) => {
                              setIngredients(prev =>
                                prev.map((ing, i) => (i === index ? (value as IngredientEnum) : ing))
                              );
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select ingredient" />
                            </SelectTrigger>
                            <SelectContent>
                              {INGREDIENTS.map(opt => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {ingredients.length > 1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setIngredients(prev => prev.filter((_, i) => i !== index))
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Instructions *</CardTitle>
                    <Button size="sm" onClick={addInstruction}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Step
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {instructions.map((instruction, index) => (
                      <div key={index} className="flex space-x-2 items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-1">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <Textarea
                            value={instruction}
                            onChange={(e) => updateInstruction(index, e.target.value)}
                            placeholder="Describe this step..."
                            rows={2}
                          />
                        </div>
                        {instructions.length > 1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeInstruction(index)}
                            className="mt-1"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview/Actions Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {imageUrl && (
                    <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={imageUrl} 
                        alt="Recipe preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-lg">
                      {title || "Recipe Title"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {description || "Recipe description will appear here..."}
                    </p>
                  </div>

                  {(prepTime || cookTime || servings) && (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {prepTime && (
                        <div>
                          <span className="font-medium">Prep:</span> {prepTime}min
                        </div>
                      )}
                      {cookTime && (
                        <div>
                          <span className="font-medium">Cook:</span> {cookTime}min
                        </div>
                      )}
                      {servings && (
                        <div className="col-span-2">
                          <span className="font-medium">Serves:</span> {servings}
                        </div>
                      )}
                    </div>
                  )}

                  {selectedDietaryTags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selectedDietaryTags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 space-y-2">
                    <Button 
                      onClick={handleSaveDraft}
                      variant="outline" 
                      className="w-full"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button 
                      onClick={handlePublish}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Publish Recipe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
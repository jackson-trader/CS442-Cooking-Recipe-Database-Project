import { RecipeDetails } from "@/src/components/RecipeDetails";
import type { ApiRecipe } from "@/src/types/recipe";

const API_BASE = process.env.BACKEND_URL ?? "http://localhost:8080";

async function getRecipe(recipeID: string): Promise<ApiRecipe> {
  const res = await fetch(`http://localhost:8080/api/recipes/r/byId/${recipeID}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load recipe");
  }

  return res.json();
}

export default async function RecipePage({
  params,
}: {
  params: { recipeID: string };
}) {
  const recipe = await getRecipe(params.recipeID);

  return <RecipeDetails recipeAPI={recipe} />;
}

import { HomeBrowse } from "@/src/components/HomeBrowse";
import { headers } from "next/headers";

type ApiRecipe = {
  recipeID: number;
  title: string;
  description?: string | null;
  prepTime?: number | null;
  cookTime?: number | null;
  servings?: number | null;
  difficulty?: number | null;
  upvotes?: number | null;
  steps?: string | null;
  ownerUsername?: { name?: string } | string | null;
  imageUrl?: string | null;
  tag?: string[] | null; 
  ingredients?: string[];
};

  export default async function Page() {
    const host = headers().get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`http://localhost:8080/api/recipes/all`, { cache: "no-store" }); // TODO: change this back to use an env variable
    const recipes: ApiRecipe[] = res.ok ? await res.json() : [];

    return <HomeBrowse recipes={recipes} />;
}

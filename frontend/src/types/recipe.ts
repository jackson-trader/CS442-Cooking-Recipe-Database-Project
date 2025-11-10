// API shape coming from Spring
export type ApiRecipe = {
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
    ingredients?: unknown[];
};

// UI shape used by the app/components
export type UiRecipe = {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    cuisine: string;
    dietaryTags: string[];
    prepTime: number;
    cookTime: number;
    servings: number;
    upvotes: number;
    bookmarkCount: number;
    author: string;
};

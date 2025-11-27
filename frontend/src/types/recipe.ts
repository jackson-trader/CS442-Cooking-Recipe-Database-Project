// API shapes coming from Spring

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

    owner?: {
        userID: number;
        username: string;
        email: string;
        recipes?: string[];
        comments?: ApiComment[];
    } | null;

    author?: string | null;
    ownerUsername?: { name?: string } | string | null;

    imageUrl?: string | null;
    tags?: string[] | null;
    ingredients?: string[];
    comments?: ApiComment[] | null;
};

export type ApiComment = {
    id: number;
    text: string;
    createdAt: string;

    commentID?: number;
    recipeID?: number;
    content?: string;
    commenterUsername?: string;
};

// UI shape used by the app/components

export type UiComment = {
    id: string;
    author: string;
    content: string;
}

export type UiRecipe = {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    dietaryTags: string[];
    prepTime: number;
    cookTime: number;
    servings: number;
    upvotes: number;
    bookmarkCount: number;
    author: string;
    ingredients: string[];
    comments: UiComment[];
    commentCount: number;
    instructions: string[];
    difficulty: number;
};

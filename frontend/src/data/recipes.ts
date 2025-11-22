import { TagEnum } from "./enums";

export interface Recipe {
  id: string;
  title: string;
  author: string;
  authorId: string;
  description: string;
  cuisine: string;
  dietaryTags: string[];
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  bookmarkCount: number;
  ingredients: {
    name: string;
    quantity: string;
    unit: string;
  }[];
  instructions: string[];
  imageUrl: string;
  isBookmarked?: boolean;
  upvotes: number;
  isUpvoted?: boolean;
  comments: {
    id: string;
    author: string;
    content: string;
    date: string;
  }[];
  createdAt: string;
}

export const mockRecipes: Recipe[] = [
  {
    id: "1",
    title: "Classic Margherita Pizza",
    author: "Maria Romano",
    authorId: "user1",
    description: "A traditional Italian pizza with fresh tomatoes, mozzarella, and basil. Simple ingredients, extraordinary flavor.",
    cuisine: "Italian",
    dietaryTags: ["Vegetarian"],
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: "Medium",
    bookmarkCount: 156,
    ingredients: [
      { name: "Pizza dough", quantity: "1", unit: "ball" },
      { name: "Tomato sauce", quantity: "1/2", unit: "cup" },
      { name: "Fresh mozzarella", quantity: "8", unit: "oz" },
      { name: "Fresh basil", quantity: "1/4", unit: "cup" },
      { name: "Olive oil", quantity: "2", unit: "tbsp" },
      { name: "Salt", quantity: "1/2", unit: "tsp" }
    ],
    instructions: [
      "Preheat oven to 475°F (245°C).",
      "Roll out pizza dough on a floured surface to desired thickness.",
      "Spread tomato sauce evenly over the dough, leaving a 1-inch border.",
      "Tear mozzarella into chunks and distribute over sauce.",
      "Drizzle with olive oil and sprinkle with salt.",
      "Bake for 12-15 minutes until crust is golden and cheese is bubbly.",
      "Remove from oven and top with fresh basil leaves.",
      "Let cool for 2-3 minutes before slicing and serving."
    ],
    imageUrl: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&h=600&fit=crop",
    upvotes: 89,
    comments: [
      {
        id: "c1",
        author: "John Smith",
        content: "Amazing recipe! The crust came out perfect. Will definitely make again.",
        date: "2024-01-15"
      },
      {
        id: "c2", 
        author: "Sarah Chen",
        content: "Love how simple yet delicious this is. Used homemade dough and it was incredible!",
        date: "2024-01-14"
      }
    ],
    createdAt: "2024-01-10"
  },
  {
    id: "2",
    title: "Creamy Chicken Tikka Masala",
    author: "Raj Patel",
    authorId: "user2",
    description: "Rich and creamy Indian curry with tender chicken in a spiced tomato sauce. Perfect comfort food.",
    cuisine: "Indian",
    dietaryTags: ["Gluten-Free"],
    prepTime: 30,
    cookTime: 45,
    servings: 6,
    difficulty: "Medium",
    bookmarkCount: 203,
    ingredients: [
      { name: "Chicken breast", quantity: "2", unit: "lbs" },
      { name: "Greek yogurt", quantity: "1", unit: "cup" },
      { name: "Tomato sauce", quantity: "1", unit: "can" },
      { name: "Heavy cream", quantity: "1/2", unit: "cup" },
      { name: "Garam masala", quantity: "2", unit: "tsp" },
      { name: "Ginger-garlic paste", quantity: "2", unit: "tbsp" },
      { name: "Onion", quantity: "1", unit: "large" }
    ],
    instructions: [
      "Cut chicken into bite-sized pieces and marinate in yogurt and spices for 30 minutes.",
      "Heat oil in a large pan and cook marinated chicken until golden. Set aside.",
      "In the same pan, sauté onions until golden brown.",
      "Add ginger-garlic paste and cook for 1 minute.",
      "Add tomato sauce and spices, simmer for 10 minutes.",
      "Return chicken to pan and add cream.",
      "Simmer for 15-20 minutes until chicken is cooked through.",
      "Garnish with cilantro and serve with rice or naan."
    ],
    imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop",
    upvotes: 134,
    comments: [
      {
        id: "c3",
        author: "Lisa Johnson",
        content: "This is restaurant quality! My family loved it. The spice level was perfect.",
        date: "2024-01-16"
      }
    ],
    createdAt: "2024-01-08"
  },
  {
    id: "3",
    title: "Fresh Garden Salad Bowl",
    author: "Emma Green",
    authorId: "user3",
    description: "A vibrant mix of fresh greens, seasonal vegetables, and a zesty homemade vinaigrette.",
    cuisine: "Mediterranean",
    dietaryTags: ["Vegan", "Gluten-Free", "Low-Carb"],
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: "Easy",
    bookmarkCount: 87,
    ingredients: [
      { name: "Mixed greens", quantity: "6", unit: "cups" },
      { name: "Cherry tomatoes", quantity: "1", unit: "cup" },
      { name: "Cucumber", quantity: "1", unit: "large" },
      { name: "Red onion", quantity: "1/4", unit: "cup" },
      { name: "Olive oil", quantity: "3", unit: "tbsp" },
      { name: "Lemon juice", quantity: "2", unit: "tbsp" },
      { name: "Dijon mustard", quantity: "1", unit: "tsp" }
    ],
    instructions: [
      "Wash and dry all vegetables thoroughly.",
      "Chop cucumber and slice red onion thinly.",
      "Halve cherry tomatoes.",
      "In a small bowl, whisk together olive oil, lemon juice, and Dijon mustard.",
      "In a large salad bowl, combine mixed greens, tomatoes, cucumber, and onion.",
      "Drizzle with dressing and toss gently to coat.",
      "Serve immediately for best freshness."
    ],
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
    upvotes: 45,
    comments: [],
    createdAt: "2024-01-12"
  },
  {
    id: "4",
    title: "Chocolate Chip Cookies",
    author: "Baker Betty",
    authorId: "user4",
    description: "Soft, chewy chocolate chip cookies that are crispy on the edges and gooey in the center.",
    cuisine: "American",
    dietaryTags: ["Vegetarian"],
    prepTime: 15,
    cookTime: 12,
    servings: 24,
    difficulty: "Easy",
    bookmarkCount: 312,
    ingredients: [
      { name: "All-purpose flour", quantity: "2 1/4", unit: "cups" },
      { name: "Butter", quantity: "1", unit: "cup" },
      { name: "Brown sugar", quantity: "3/4", unit: "cup" },
      { name: "White sugar", quantity: "3/4", unit: "cup" },
      { name: "Eggs", quantity: "2", unit: "large" },
      { name: "Vanilla extract", quantity: "2", unit: "tsp" },
      { name: "Chocolate chips", quantity: "2", unit: "cups" }
    ],
    instructions: [
      "Preheat oven to 375°F (190°C).",
      "Cream together butter and both sugars until light and fluffy.",
      "Beat in eggs one at a time, then vanilla.",
      "Gradually mix in flour, baking soda, and salt.",
      "Stir in chocolate chips.",
      "Drop rounded tablespoons of dough onto ungreased cookie sheets.",
      "Bake 9-11 minutes until golden brown.",
      "Cool on baking sheet for 2 minutes before removing to wire rack."
    ],
    imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop",
    upvotes: 187,
    comments: [
      {
        id: "c4",
        author: "Mike Wilson",
        content: "These turned out amazing! Followed the recipe exactly and they were perfect.",
        date: "2024-01-17"
      }
    ],
    createdAt: "2024-01-05"
  }
];

export const cuisineTypes = [
  "All",
  "Italian", 
  "Mexican",
  "Indian",
  "Chinese",
  "Mediterranean",
  "American",
  "French",
  "Thai",
  "Japanese"
];

export const dietaryFilters: TagEnum[] = [
  "VEGAN",
  "VEGETARIAN",
  "GLUTEN_FREE",
  "DAIRY_FREE",
  "KETO",
  "PALEO",
  "LOW_CARB",
  "HIGH_PROTEIN",
  "QUICK_EASY",
  "DESSERT",
  "APPETIZER",
];

export const timeFilters = [
  "All",
  "Under 30 min",
  "30-60 min", 
  "1-2 hours",
  "2+ hours"
];
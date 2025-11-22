import { Button } from "./ui/button";
import { ChefHat, Home, Plus, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useSession } from "../context/CsrfContext";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  displayName: string;
  email: string;
}

interface NavigationProps {
  user?: User;
  currentPage?: string;
  onHome?: () => void;
  onProfile?: () => void;
  onCreateRecipe?: () => void;
  onSignIn?: () => void;
  onSignUp?: () => void;
  onSignOut?: () => void;
}


export function Navigation() {
  const { user, logout } = useSession();
  const router = useRouter();
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">FlavorDB</span>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Authenticated Navigation */}
                <Button
                  onClick={() => router.push("/")}
                  className="hidden sm:flex items-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>

                <Button
                  onClick={() => router.push("/recipes/create")}
                  className="hidden sm:flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Recipe</span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">My Profile</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => router.push("/me")}>
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="sm:hidden" />
                    <DropdownMenuItem onClick={() => router.push("/browse")} className="sm:hidden">
                      <Home className="mr-2 h-4 w-4" />
                      Browse Recipes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/create")} className="sm:hidden">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Recipe
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Guest Navigation */}
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/")}
                    className="hidden sm:flex items-center space-x-2"
                  >
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/sign-in")}>
                    Sign In
                  </Button>
                  <Button variant="default" onClick={() => router.push("/sign-up")} className="bg-orange-500 hover:bg-orange-600">
                    Sign Up
                  </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
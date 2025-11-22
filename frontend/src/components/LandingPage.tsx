import { useSession } from "../context/CsrfContext";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ChefHat, Search, Heart, Users } from "lucide-react";

interface LandingPageProps {
  onSignIn: () => void;
  onSignUp: () => void;
  onBrowseGuest: () => void;
}

export function LandingPage({ onSignIn, onSignUp, onBrowseGuest }: LandingPageProps) {
  const {user, loading, logout} = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">FlavorDB</span>
          </div>
              {!user && (
          <div className="space-x-4">
            <Button variant="outline" onClick={onSignIn}>
              Sign In
            </Button>
            <Button onClick={onSignUp} className="bg-orange-500 hover:bg-orange-600">
              Sign Up
            </Button>
          </div>
          )}
          {user && (
                <div className="space-x-4">
            <Button onClick={logout} className="bg-orange-500 hover:bg-orange-600">
              Logout
            </Button>
          </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Discover & Share
            <span className="text-orange-500 block">Amazing Recipes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of food lovers. Find new recipes, save your favorites, 
            and share your culinary creations with the world.
          </p>
          {!user && (
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button 
              size="lg" 
              onClick={onSignUp}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
            >
              Get Started - It's Free!
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={onBrowseGuest}
              className="px-8 py-3"
            >
              Browse as Guest
            </Button>
          </div>
          )}
          {user && (
                <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button 
              size="lg" 
              onClick={onBrowseGuest}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
            >
              Browse Recipes
            </Button>
          </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Search className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <CardTitle>Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Find recipes by cuisine, dietary preferences, cooking time, and more with our powerful search tools.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Heart className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <CardTitle>Save Favorites</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Bookmark your favorite recipes and create personalized collections for easy access anytime.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <CardTitle>Share & Connect</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Share your own recipes, rate others, and connect with fellow cooking enthusiasts in our community.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-orange-500 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Cooking?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of home cooks sharing their favorite recipes!
          </p>
          <div className="space-x-4">
            <Button 
              size="lg" 
              variant="outline"
              onClick={onSignUp}
              className="border-orange-500 text-orange-500 bg-white hover:bg-orange-50"
            >
              Create Account
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={onBrowseGuest}
              className="border-orange-500 text-orange-500 bg-white hover:bg-orange-50"
            >
              Explore Recipes
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>© 2025 FlavorDB</p>
      </footer>
    </div>
  );
}
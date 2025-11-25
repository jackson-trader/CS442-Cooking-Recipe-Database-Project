'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface SignUpProps {
  onSignUp?: (displayName: string, email: string, password: string) => boolean | Promise<boolean>;
  onSignIn?: () => void;
  onBack?: () => void;
}

export function SignUp({ onSignUp, onSignIn, onBack }: SignUpProps) {
  const router = useRouter();
  const go = (path: string) => router.push(path as Route);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!displayName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }


    // Run custom onSignUp or default to mock success
    const success = onSignUp
        ? await onSignUp(displayName, email, password)
        : true;

    if (!success) {
      setError("Failed to create account. Please try again.");
      setIsLoading(false);
      return;
    }

    // default navigation
    go("/sign-in");
    setIsLoading(false);
  };

  const handleSignIn = () => (onSignIn ? onSignIn() : go("/sign-in"));
  const goBack   = () => (onBack ? onBack() : router.back());

  return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back to home */}
          <div className="mb-8">
            <Button
                variant="ghost"
                className="p-0 h-auto hover:bg-transparent"
                onClick={goBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-2xl font-bold text-primary">FlavorDB</span>
            </Button>
          </div>

          <Card className="w-full">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Create your account</CardTitle>
              <CardDescription className="text-center">
                Join FlavorDB to save and share your favorite recipes
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                      id="displayName"
                      type="text"
                      placeholder="Enter your display name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                  />
                </div>

                <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </CardContent>
            </form>

            <CardFooter>
              <div className="text-center text-sm text-muted-foreground w-full">
                Already have an account?{" "}
                <Button
                    variant="link"
                    className="p-0 h-auto text-primary hover:text-orange-500"
                    onClick={handleSignIn}
                >
                  Sign in
                </Button>
              </div>
            </CardFooter>
          </Card>

        </div>
      </div>
  );
}

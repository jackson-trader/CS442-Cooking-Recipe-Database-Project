'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import {Route} from "next";

type SignInProps = {
  onSignIn?: (username: string, password: string) => Promise<boolean>;
  onSignUp?: () => void;
  onBack?: () => void;
};

export function SignIn({ onSignIn, onSignUp, onBack }: SignInProps) {
  const router = useRouter();
  const [username, setUsername]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!username || !password) {
      setError("Please enter both username and password");
      setIsLoading(false);
      return;
    }

    const success = onSignIn
        ? await onSignIn(username, password)
        : true;
    if (!success) setError("Invalid username or password");
    else router.push("/browse");

    setIsLoading(false);
  };

  const goSignUp = () => (onSignUp ? onSignUp() : router.push("/sign-up" as Route));
  const goBack   = () => (onBack ? onBack() : router.back());

  return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Button variant="ghost" className="p-0 h-auto hover:bg-transparent" onClick={goBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-2xl font-bold text-primary">FlavorDB</span>
            </Button>
          </div>


          <Card className="w-full">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Sign in to your account</CardTitle>
              <CardDescription className="text-center">
                Enter your email and password to access your recipe collection
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
                  <Label htmlFor="username">Username</Label>
                  <Input
                      id="username"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full"
                      required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full"
                      required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm">Remember me</Label>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </CardContent>
            </form>

            <CardFooter>
              <div className="text-center text-sm text-muted-foreground w-full">
                Don&apos;t have an account?{" "}
                <Button variant="link" className="p-0 h-auto text-primary hover:text-orange-500" onClick={goSignUp}>
                  Sign up for free
                </Button>
              </div>
            </CardFooter>
          </Card>

        </div>
      </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/src/context/CsrfContext";
import { MyProfile } from "@/src/components/MyProfile";

export default function MePage() {
  const router = useRouter();
  const { user, loading, logout } = useSession();

  if (loading) return <p>Loading...</p>;


  if (!user) {
    router.push("/sign-in");
    return null;
  }

  const profileUser = {
    id: user.username,
    displayName: user.username,
    email: user.email ?? user.username,
  };

  return (
      <MyProfile
          user={profileUser}
          onHome={() => router.push("/")}
          onCreateRecipe={() => router.push("/create")}
          onRecipeClick={(recipeId: string) => router.push(`/recipes/${recipeId}`)}
          onSignOut={logout}
      />
  );
}

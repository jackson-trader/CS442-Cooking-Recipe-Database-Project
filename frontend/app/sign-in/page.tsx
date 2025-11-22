"use client";

import { useRouter } from "next/navigation";
import { SignIn } from "@/src/components/SignIn";
import { useApi } from "@/src/lib/apiClient";
import { useSession } from "@/src/context/CsrfContext";

type User = {
  id: string;
  displayName: string;
  email: string;
};

export default function Page() {
  const router = useRouter();
  const { apiFetch } = useApi();
  const {login} = useSession();

  const handleSignIn = async (email: string, password: string): Promise<boolean> => {
    try {
      await login(email, password);
      router.push("/browse");
      return true;
    } catch (err) {
      console.error("Error during login:", err);
      return false;
    }
  };

  return (
      <SignIn
          onSignIn={handleSignIn}
          onBack={() => router.push("/")}
          onSignUp={() => router.push("/sign-up")}
      />
  );
}

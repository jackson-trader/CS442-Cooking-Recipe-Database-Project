"use client";

import { useRouter } from "next/navigation";
import { SignIn } from "@/src/components/SignIn";
import { useApi } from "@/src/lib/apiClient";
import { Button } from "@/src/components/ui/button";

type User = {
  username: string;
};

export default function MePage() {
  const { apiFetch } = useApi();

  const handleCall = async (): Promise<boolean> => {
    try {
      const loginRes = await apiFetch("/api/auth/me", {
        method: "GET"
      });

      if (!loginRes.ok) {
        console.error("Login failed with status", loginRes.status);
        return false;
      }


      const meRes = await apiFetch("/api/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        console.log("meData:", meData);
        const user: User = {
          username: meData.username,
        };


        console.log("Logged in as", user);
      }

      return true;
    } catch (err) {
      console.error("Error during login:", err);
      return false;
    }
  };

  return (
               <Button
                onClick={handleCall}
            /> 
  )
}

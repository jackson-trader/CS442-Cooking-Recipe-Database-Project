"use client";

import { useSession } from "@/src/context/CsrfContext";


export default function MePage() {
  const { user, loading } = useSession();

  if (loading) return <p>Loading</p>;
  if (!user) return <p>Not Signed In</p>;
  return <p>Signed In: {user.username}</p>;
}

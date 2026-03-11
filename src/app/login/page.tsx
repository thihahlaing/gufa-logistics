"use client";

import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const supabase = createClient();

  const handleSignInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <button onClick={handleSignInWithGoogle} className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2">
        Sign In with Google
      </button>
    </div>
  );
}

"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    // Redirect back to the login gate once the session is destroyed
                    router.push("/login");
                    router.refresh(); // Forces Next.js to clear any cached protected data
                },
                onError: (ctx) => {
                    console.error("Logout failed:", ctx.error.message);
                    setIsLoggingOut(false);
                }
            }
        });
    };

    return (
        <button 
            onClick={handleLogout} 
            disabled={isLoggingOut}
            // Add your glassmorphism/luxury Tailwind classes here
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-[0.1em] uppercase text-white/40 hover:text-[#D4AF37] hover:bg-white/5 rounded-md transition-all duration-300 disabled:opacity-50"
        >
            {isLoggingOut ? "Locking..." : "Sign Out"}
        </button>
    );
}
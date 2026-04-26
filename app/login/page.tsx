"use client";

import { useState } from "react";
import { authClient } from "../../lib/auth-client"; 
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleAuth = async () => {
        setErrorMessage("");
        setIsLoading(true);

        // ONLY SIGN IN LOGIC REMAINS
        const { error } = await authClient.signIn.email({
            email: email,
            password: password,
            callbackURL: "/dashboard" // Redirect after success
        });
        
        if (error) {
            setErrorMessage(error.message || "Unauthorized access.");
            setIsLoading(false);
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] font-sans">
            <div className="p-12 rounded-3xl bg-[#141414]/80 border border-white/5 backdrop-blur-2xl shadow-2xl w-full max-w-md relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-[#D4AF37]/50 blur-sm"></div>

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white">VocaLog AI</h1>
                    <p className="text-[#D4AF37]/60 mt-3 text-xs tracking-widest uppercase">Admin Gateway</p>
                </div>
                
                <div className="space-y-5">
                    {errorMessage && <p className="text-red-400 text-sm text-center">{errorMessage}</p>}
                    <input 
                        type="email" 
                        placeholder="Admin Email"
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-4 text-white focus:border-[#D4AF37]/50 focus:outline-none transition-all"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Passcode"
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-4 text-white focus:border-[#D4AF37]/50 focus:outline-none transition-all"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                        onClick={handleAuth}
                        disabled={isLoading}
                        className="w-full bg-[#1E1610] text-[#E0E0E0] border border-[#3C2A1A] hover:border-[#D4AF37]/50 font-semibold p-4 rounded-xl mt-6 transition-all"
                    >
                        {isLoading ? "Verifying..." : "Authorize Access"}
                    </button>
                </div>
            </div>
        </div>
    );
}
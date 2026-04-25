"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client"; // We'll create this next

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        await authClient.signIn.email({
            email: username, // Better Auth uses email field for ID
            password: password,
            callbackURL: "/dashboard",
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f1115]">
            {/* Glassmorphism Card */}
            <div className="p-10 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-white mb-2">VocaLog AI</h1>
                <p className="text-gray-400 mb-8">Admin Portal</p>
                
                <div className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Username"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Password"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                        onClick={handleLogin}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold p-3 rounded-lg mt-4 transition-colors"
                    >
                        Login as Admin
                    </button>
                </div>
            </div>
        </div>
    );
}
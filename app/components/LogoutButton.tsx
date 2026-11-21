"use client";

import { useState, useTransition } from "react";
import { logoutAction } from "../actions/auth-actions";

export default function LogoutButton() {
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(() => {
            logoutAction();
        });
    };

    return (
        <button 
            onClick={handleLogout} 
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-[0.1em] uppercase text-white/40 hover:text-[#D4AF37] hover:bg-white/5 rounded-md transition-all duration-300 disabled:opacity-50"
        >
            {isPending ? "Locking..." : "Sign Out"}
        </button>
    );
}
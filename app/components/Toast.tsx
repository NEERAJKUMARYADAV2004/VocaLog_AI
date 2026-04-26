"use client";

import { useEffect } from "react";

interface ToastProps {
    message: string;
    type: "success" | "error";
    onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-10 right-10 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className={`px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-4 ${
                type === "success" 
                ? "bg-green-500/10 border-green-500/20 text-green-400" 
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}>
                <div className={`h-2 w-2 rounded-full animate-pulse ${type === "success" ? "bg-green-500" : "bg-red-500"}`} />
                <p className="text-sm font-medium tracking-wide uppercase">{message}</p>
                <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100 text-white">✕</button>
            </div>
        </div>
    );
}
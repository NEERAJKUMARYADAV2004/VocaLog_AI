"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (email === "admin@vocalog.com" && password === "vocalog2026") {
        const cookieStore = await cookies();
        cookieStore.set("vocalog_session", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return { success: true };
    }

    return { success: false, error: "Invalid admin credentials" };
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("vocalog_session");
    redirect("/login");
}

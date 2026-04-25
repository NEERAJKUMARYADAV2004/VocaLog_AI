import { auth } from "@/lib/auth"; // This pulls your config from the lib folder
import { toNextJsHandler } from "better-auth/next-js";

// This exports the GET and POST methods so Better Auth can use them
export const { GET, POST } = toNextJsHandler(auth);
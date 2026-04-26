// prisma.config.ts
import "dotenv/config"; // 👈 THIS IS THE CRITICAL LINE
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Tell the CLI where your schema is
  schema: "prisma/schema.prisma",
  
  datasource: {
    // This helper ensures the CLI waits for the env variable to load
    url: env("DATABASE_URL"), 
  },
});
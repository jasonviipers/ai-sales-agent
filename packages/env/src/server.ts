import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    PORT: z.string().default("3000").transform(Number),
    HOST: z.string().default("0.0.0.0"),
    CORS_ORIGIN: z
      .string()
      .default("http://localhost:3001,http://localhost:3000")
      .transform((origins) =>
        origins.split(",").map((origin) => origin.trim()),
      ),
    DATABASE_URL: z.url(),
    // Redis Configuration
    REDIS_URL: z.string().default("redis://localhost:6379"),
    // Auth Configuration
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    // Better auth
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.url(),
    // stripe
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    // open router
    OPEN_ROUTER_API_KEY: z.string(),
    // Resend api
    RESEND_API_KEY: z.string(),
    // AI Sales specific
    OPENAI_API_KEY: z.string().optional(),
    ELEVENLABS_API_KEY: z.string().optional(),
    BRIGHT_DATA_USERNAME: z.string().optional(),
    BRIGHT_DATA_PASSWORD: z.string().optional(),
    // Model Name
    AI_MODEL_NAME: z.string(),
  },
  experimental__runtimeEnv: process.env,
});

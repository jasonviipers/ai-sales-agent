import { z } from "zod";


const envSchema = z.object({
    // Server Configuration
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: z.string().default("3000").transform(Number),
    HOST: z.string().default("0.0.0.0"),
    CORS_ORIGIN: z.string().default("http://localhost:3001,http://localhost:3000"),
    // Database Configuration
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
});

const env = envSchema.parse(process.env);
export const config = {
    server: {
        nodeEnv: env.NODE_ENV,
        port: env.PORT,
        host: env.HOST,
        CORS_ORIGIN: env.CORS_ORIGIN.split(","),
        isDevelopment: env.NODE_ENV === "development",
        isProduction: env.NODE_ENV === "production",
        isTest: env.NODE_ENV === "test",
    },
    redis: {
        url: env.REDIS_URL,
    },
    resend: {
        apiKey: env.RESEND_API_KEY,
    },
    database: {
        url: env.DATABASE_URL,
    },
    ai: {
        modelName: env.AI_MODEL_NAME,
        openRouter: {
            apiKey: env.OPEN_ROUTER_API_KEY,
        },
        openai: {
            apiKey: env.OPENAI_API_KEY || "",
        },
        elevenlabs: {
            apiKey: env.ELEVENLABS_API_KEY || "",
        }
    },
    scraping: {
        brightData: {
            username: env.BRIGHT_DATA_USERNAME || "",
            password: env.BRIGHT_DATA_PASSWORD || "",
        }
    },
    auth: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
        github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        },
        betterAuth: {
            secret: env.BETTER_AUTH_SECRET,
            baseUrl: env.BETTER_AUTH_URL,
        },
    },
    stripe: {
        secretKey: env.STRIPE_SECRET_KEY,
        webhookSecret: env.STRIPE_WEBHOOK_SECRET,
    }
}
export { env };

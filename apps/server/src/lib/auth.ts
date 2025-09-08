import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey"
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { EmailTemplate } from "@daveyplate/better-auth-ui/server"
import * as schema from '@workspace/database/auth'
import { db } from '@workspace/database/db'
import { stripe } from "@better-auth/stripe"
import { env } from "@workspace/env/server"
import { Resend } from "resend"
import Stripe from "stripe"

const stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
	apiVersion: "2025-08-27.basil",
	typescript: true,
})

const resend = new Resend(env.RESEND_API_KEY)

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	trustedOrigins: [env.CORS_ORIGIN],
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
	socialProviders: {
		google: {
			accessType: "offline",
			prompt: "select_account consent",
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		}
	},
	plugins: [
		passkey(),
		stripe({
			stripeClient,
			stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
			createCustomerOnSignUp: true,
		}),
		magicLink({
			sendMagicLink: async ({ email, url }) => {
				await resend.emails.send({
					from: "onboarding@resend.dev",
					to: email,
					subject: "Sign in to your account",
					react: EmailTemplate({
						action: "Sign in",
						content: "Click the link below to sign in to your account",
						heading: "Sign in to your account",
						siteName: "AI Sales",
						baseUrl: env.BETTER_AUTH_URL,
						url,
					}),
				})
			}
		})
	],
});

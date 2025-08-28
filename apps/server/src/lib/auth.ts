import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey"
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { EmailTemplate } from "@daveyplate/better-auth-ui/server"
import { stripe } from "@better-auth/stripe"
import Stripe from "stripe"
import { Resend } from "resend"
import { db } from "@/db";
import * as schema from "@/db/schema/auth";
import { config } from "@/config";

const stripeClient = new Stripe(config.stripe.secretKey, {
	apiVersion: "2025-08-27.basil",
	typescript: true,
})

const resend = new Resend(config.resend.apiKey)

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	trustedOrigins: config.server.CORS_ORIGIN,
	secret: config.auth.betterAuth.secret,
	baseURL: config.auth.betterAuth.baseUrl,
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
			clientId: config.auth.google.clientId,
			clientSecret: config.auth.google.clientSecret,
		},
		github: {
			clientId: config.auth.github.clientId,
			clientSecret: config.auth.github.clientSecret,
		}
	},
	plugins: [passkey(),
	stripe({
		stripeClient,
		stripeWebhookSecret: config.stripe.webhookSecret,
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
					baseUrl: config.auth.betterAuth.baseUrl,
					url,
				}),
			})
		}
	})
	],
});

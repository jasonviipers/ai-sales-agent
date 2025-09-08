import { stripeClient } from "@better-auth/stripe/client";
import { magicLinkClient, passkeyClient, organizationClient, lastLoginMethodClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "@workspace/env/client"

export const authClient = createAuthClient({
	baseURL: env.NEXT_PUBLIC_SERVER_URL,
	plugins: [
		passkeyClient(),
		magicLinkClient(),
		stripeClient({
			subscription: false,
		}),
		organizationClient(),
		lastLoginMethodClient()
	],
});

export const { signIn, signUp, signOut, useSession, getSession, getLastUsedLoginMethod } = authClient;

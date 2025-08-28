import { createAuthClient } from "better-auth/react";
import { stripeClient } from "@better-auth/stripe/client"
import { passkeyClient, magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
	plugins: [passkeyClient(), magicLinkClient(),
	stripeClient({
		subscription: false
	})],
});

export const {
	signIn,
	signUp,
	signOut,
	useSession,
	getSession,
} = authClient;

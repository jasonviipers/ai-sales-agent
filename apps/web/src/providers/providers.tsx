"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { queryClient } from "@/utils/orpc";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "../components/ui/sonner";
import { authClient } from "@/lib/auth-client"

export default function Providers({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<AuthUIProvider
				authClient={authClient}
				navigate={router.push}
				replace={router.replace}
				onSessionChange={() => { router.refresh() }}
				Link={Link}
				credentials={false}
				passkey={true}
				magicLink={true}
				social={{
					providers: ["github", "google"]
				}}
				settings={{
					url: "/dashboard/settings"
				}}>
				<QueryClientProvider client={queryClient}>
					{children}
					<ReactQueryDevtools />
				</QueryClientProvider>
				<Toaster richColors />
			</AuthUIProvider>
		</ThemeProvider>
	);
}

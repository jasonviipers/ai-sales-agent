"use client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { queryClient } from "@/lib/orpc";
import { Toaster } from "@workspace/ui/components/sonner";
import { ThemeProvider } from "./theme-provider";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

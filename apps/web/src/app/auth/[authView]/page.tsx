import { Button } from "@/components/ui/button"
import { AuthLoading, AuthView } from "@daveyplate/better-auth-ui"
import { authViewPaths } from "@daveyplate/better-auth-ui/server"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const dynamicParams = false

export function generateStaticParams() {
    return Object.values(authViewPaths).map((path) => ({ path }))
}

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
    const { path } = await params

    return (
        <main className="container flex grow flex-col items-center justify-center self-center p-4 md:p-6">
            <Link href="/" className="absolute top-6 left-8">
                <Button
                    variant="outline"
                    className="hover:bg-secondary hover:text-secondary-foreground"
                    size="sm"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
            </Link>
            {/* <AuthLoading>
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
                    <p className="mt-4 text-sm text-gray-500">Loading...</p>
                </div>
            </AuthLoading> */}
            <AuthView path={path} />
            <div className="text-center text-muted-foreground text-sm">
                <p>
                    You agree to our{" "}
                    <Link href={{ pathname: "/terms" }}
                        className="underline hover:text-foreground"
                    >
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href={{ pathname: "/privacy" }}
                        className="underline hover:text-foreground"
                    >
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </main>
    )
}
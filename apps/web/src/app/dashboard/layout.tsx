import { RedirectToSignUp, SignedIn } from "@daveyplate/better-auth-ui"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { ModeToggle } from "@/components/layout/mode-toggle"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar"
import { DynamicBreadcrumb } from "@/components/layout/dynamic-breadcrumb"


export default function ProtectedPage({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <RedirectToSignUp />
            <SignedIn>
                <SidebarProvider defaultOpen={false}>
                    <AppSidebar />
                    <SidebarInset>
                        <div className="@container">
                            <div className="mx-auto w-full">
                                <header className="flex flex-wrap items-center gap-3 border-b p-3 transition-all ease-linear">
                                    <div className="flex flex-1 items-center gap-2">
                                        <SidebarTrigger className="rounded-full" />
                                        <div className="max-lg:hidden lg:contents">
                                            <Separator
                                                orientation="vertical"
                                                className="me-2 data-[orientation=vertical]:h-4"
                                            />
                                            <DynamicBreadcrumb />
                                        </div>
                                    </div>
                                    {/* Right side */}
                                    <ModeToggle />
                                </header>
                                <div className="overflow-hidden">
                                    <div className="container p-6">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </SignedIn>
        </>
    )
}
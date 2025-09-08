import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Button } from "@workspace/ui/components/button";
// import { useAuthRedirect } from "@/hooks/useAuthRedirect";
// import Loader from "@/components/loader";

export default function AuthPage() {
  // const { isPending } = useAuthRedirect("/dashboard", false);

  // if (isPending) {
  //     return <Loader />;
  // }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
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
      <div className="w-full max-w-sm">
        <AuthForm />
      </div>
    </div>
  );
}

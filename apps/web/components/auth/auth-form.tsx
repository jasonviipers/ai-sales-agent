"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { AlertCircle, Key, Loader2 } from "lucide-react";
import { IconRobot } from "@tabler/icons-react";
import { getLastUsedLoginMethod, signIn } from "@/lib/auth-client";
import z from "zod";
import { emailSchema } from "@/lib/validation";
import { cn } from "@workspace/ui/lib/utils";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { GitHub, Google } from "../icons/icons";


interface AuthError {
  message: string;
  code?: string;
}

type LoginMethod = "magicLink" | "passkey" | "github" | "google";

interface LoginFormProps extends React.ComponentProps<"div"> {
  callbackURL?: string;
}

export function LoginForm({
  className,
  callbackURL = "/dashboard",
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [isPending, startTransition] = useTransition();
  const [currentMethod, setCurrentMethod] = useState<LoginMethod | null>(null);
  const [lastMethod, setLastMethod] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLastMethod(getLastUsedLoginMethod())
  }, [])

  const handleAuthError = (error: unknown) => {
    console.error("Authentication error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An error occurred during sign in. Please try again.";

    setAuthError({
      message: errorMessage,
      code: typeof error === "object" && error !== null && "code" in error
        ? String(error.code)
        : undefined,
    });
  };

  const validateEmail = (emailValue: string): boolean => {
    try {
      emailSchema.parse(emailValue);
      setEmailError("");
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.issues[0]?.message || "Invalid email");
      } else {
        setEmailError("Please enter a valid email address");
      }
      return false;
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    if (emailError) setEmailError("");
    if (authError) setAuthError(null);
  };

  const handleMagicLinkSignIn = async () => {
    if (!validateEmail(email)) {
      emailInputRef.current?.focus();
      return;
    }

    setAuthError(null);
    setCurrentMethod("magicLink");

    startTransition(async () => {
      try {
        const result = await signIn.magicLink(
          { email },
          {
            onRequest: () => { },
            onResponse: () => { },
            onError: handleAuthError,
          },
        );

        if (result?.data?.status) {
          setAuthError(null);
        }
      } catch (error) {
        handleAuthError(error);
      } finally {
        setCurrentMethod(null);
      }
    });
  };

  const handlePasskeySignIn = async () => {
    setAuthError(null);
    setCurrentMethod("passkey");

    startTransition(async () => {
      try {
        await signIn.passkey();
      } catch (error) {
        handleAuthError(error);
      } finally {
        setCurrentMethod(null);
      }
    });
  };

  const handleSocialSignIn = async (provider: LoginMethod) => {
    setAuthError(null);
    setCurrentMethod(provider);

    startTransition(async () => {
      try {
        await signIn.social({
          provider,
          callbackURL,
        });
      } catch (error) {
        handleAuthError(error);
      } finally {
        setCurrentMethod(null);
      }
    });
  };

  const handleGithubSignIn = () => {
    handleSocialSignIn("github").catch((error) => {
      console.error("Github sign-in failed:", error);
    });
  };

  const handleGoogleSignIn = () => {
    handleSocialSignIn("google").catch((error) => {
      console.error("Google sign-in failed:", error);
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleMagicLinkSignIn();
  };

  const isLoading = (method: LoginMethod) => isPending && currentMethod === method;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form ref={formRef} onSubmit={handleMagicLinkSignIn} noValidate>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <IconRobot className="size-12 text-green-500" />
              </div>
            </div>
          </div>

          {authError && (
            <Alert variant="destructive" role="alert">
              <AlertCircle className="size-4" />
              <AlertDescription>{authError.message}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                ref={emailInputRef}
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="m@example.com"
                required
                autoComplete="email"
                disabled={isPending}
                className={emailError ? "border-red-500 focus:border-red-500" : ""}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "email-error" : undefined}
              />
              {emailError && (
                <p
                  id="email-error"
                  className="text-red-500 text-sm"
                  role="alert"
                >
                  {emailError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="relative w-full bg-green-700 hover:bg-green-800"
            >
              {isLoading('magicLink') ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Sending magic link...
                </>
              ) : (
                <>
                  Sign in with Magic Link
                  {lastMethod === "email" && (
                    <Badge
                      variant="secondary"
                      className="absolute -right-1 -top-1 text-xs"
                    >
                      Last used
                    </Badge>
                  )}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              type="button"
              className="relative w-full"
              onClick={handlePasskeySignIn}
              disabled={isPending}
            >
              {isLoading('passkey') ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Key className="mr-2 size-4" />
                  Sign in with Passkey
                  {lastMethod === "passkey" && (
                    <Badge
                      variant="secondary"
                      className="absolute -right-1 -top-1 text-xs"
                    >
                      Last used
                    </Badge>
                  )}
                </>
              )}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Button
              variant="outline"
              type="button"
              className="relative w-full"
              onClick={handleGithubSignIn}
              disabled={isPending}
              aria-label="Sign in with Github"
            >
              {isLoading('github') ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <GitHub className="mr-2 size-5" />
                  Github
                  {lastMethod === "github" && (
                    <Badge
                      variant="secondary"
                      className="absolute -right-1 -top-1 text-xs"
                    >
                      Last used
                    </Badge>
                  )}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              type="button"
              className="relative w-full"
              onClick={handleGoogleSignIn}
              disabled={isPending}
              aria-label="Sign in with Google"
            >
              {isLoading('google') ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Google className="mr-2 size-5" />
                  Google
                  {lastMethod === "google" && (
                    <Badge
                      variant="secondary"
                      className="absolute -right-1 -top-1 text-xs"
                    >
                      Last used
                    </Badge>
                  )}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      <div className="text-balance text-center text-xs text-muted-foreground">
        By continuing, you agree to our{" "}
        <a
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
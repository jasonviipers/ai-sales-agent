"use client";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
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
import { AUTH_BUTTON_TEXT, AUTH_ERROR_MESSAGES, LOADING_MESSAGES } from "@/lib/constants";

// Types
interface AuthError {
  message: string;
  code?: string;
}

type SocialProvider = "github" | "google";
type AuthMethod = "magicLink" | "passkey" | SocialProvider;
type LastUsedMethod = "email" | "passkey" | SocialProvider;

interface LoginFormProps extends React.ComponentProps<"div"> {
  callbackURL?: string;
}

// Custom hook with proper cleanup
const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay],
  );
};

export function AuthForm({
  className,
  callbackURL = "/dashboard",
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [isPending, startTransition] = useTransition();
  const [currentMethod, setCurrentMethod] = useState<AuthMethod | null>(null);
  const [lastMethod, setLastMethod] = useState<LastUsedMethod | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const lastUsedMethod = getLastUsedLoginMethod();
    setLastMethod(lastUsedMethod as LastUsedMethod);
  }, []);

  const handleAuthError = useCallback((error: unknown) => {
    console.error("Authentication error:", error);

    let errorMessage = "An error occurred during sign in. Please try again.";
    let errorCode: string | undefined;

    if (error && typeof error === "object") {
      if ("code" in error && typeof error.code === "string") {
        errorCode = error.code;
        errorMessage =
          AUTH_ERROR_MESSAGES[
          error.code as keyof typeof AUTH_ERROR_MESSAGES
          ] || errorMessage;
      } else if ("message" in error && typeof error.message === "string") {
        errorMessage = error.message;
      }
    }

    setAuthError({
      message: errorMessage,
      code: errorCode,
    });
  }, []);

  const validateEmail = useCallback((emailValue: string): boolean => {
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
  }, []);

  const debouncedValidation = useDebounce((email: string) => {
    if (email.trim()) {
      validateEmail(email);
    }
  }, 300);

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setEmail(value);

      // Clear errors immediately
      if (emailError) setEmailError("");
      if (authError) setAuthError(null);

      // Debounced validation for better UX
      debouncedValidation(value);
    },
    [emailError, authError, debouncedValidation],
  );

  const handleMagicLinkSignIn = useCallback(async () => {
    const trimmedEmail = email.trim();
    if (!validateEmail(trimmedEmail)) {
      emailInputRef.current?.focus();
      return;
    }

    setAuthError(null);
    setCurrentMethod("magicLink");

    startTransition(async () => {
      try {
        const result = await signIn.magicLink(
          { email: trimmedEmail },
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
  }, [email, validateEmail, handleAuthError]);

  const handlePasskeySignIn = useCallback(async () => {
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
  }, [handleAuthError]);

  const handleSocialSignIn = useCallback(
    async (provider: SocialProvider) => {
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
    },
    [callbackURL, handleAuthError],
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleMagicLinkSignIn();
    },
    [handleMagicLinkSignIn],
  );

  const isLoading = useCallback(
    (method: AuthMethod) => isPending && currentMethod === method,
    [isPending, currentMethod],
  );

  const renderLastUsedBadge = useCallback(
    (method: LastUsedMethod) => {
      if (lastMethod === method || (method === "email" && lastMethod === "email")) {
        return (
          <Badge
            variant="lastUsed"
            className="absolute -right-1 -top-1 text-xs"
          >
            Last used
          </Badge>
        );
      }
      return null;
    },
    [lastMethod],
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form ref={formRef} onSubmit={handleFormSubmit} noValidate>
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <IconRobot className="size-12 text-green-500" />
              </div>
            </div>
          </div>

          {/* Error Display */}
          {authError && (
            <Alert variant="destructive" role="alert">
              <AlertCircle className="size-4" />
              <AlertDescription>{authError.message}</AlertDescription>
            </Alert>
          )}

          {/* Email Form */}
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
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                disabled={isPending}
                className={emailError ? "border-red-500 focus:border-red-500" : ""}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "email-error email-hint" : "email-hint"}
              />
              <p id="email-hint" className="text-sm text-muted-foreground">
                We'll receive a secure link to sign in
              </p>
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

            {/* Magic Link Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="relative w-full bg-green-700 hover:bg-green-800"
              aria-describedby="magic-link-description"
            >
              {isLoading("magicLink") ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  {LOADING_MESSAGES.magicLink}
                </>
              ) : (
                <>
                  {AUTH_BUTTON_TEXT.magicLink}
                  {renderLastUsedBadge("email")}
                </>
              )}
            </Button>
            <p id="magic-link-description" className="sr-only">
              Sign in with a secure link sent to your email
            </p>

            {/* Passkey Button */}
            <Button
              variant="outline"
              type="button"
              className="relative w-full"
              onClick={handlePasskeySignIn}
              disabled={isPending}
              aria-describedby="passkey-description"
            >
              {isLoading("passkey") ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  {LOADING_MESSAGES.passkey}
                </>
              ) : (
                <>
                  <Key className="mr-2 size-4" />
                  {AUTH_BUTTON_TEXT.passkey}
                  {renderLastUsedBadge("passkey")}
                </>
              )}
            </Button>
            <p id="passkey-description" className="sr-only">
              Sign in using biometric authentication or security key
            </p>
          </div>

          {/* Divider */}
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>

          {/* Social Buttons */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Button
              variant="outline"
              type="button"
              className="relative w-full"
              onClick={() => handleSocialSignIn("github")}
              disabled={isPending}
              aria-describedby="github-description"
            >
              {isLoading("github") ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  {LOADING_MESSAGES.github}
                </>
              ) : (
                <>
                  <GitHub className="mr-2 size-5" />
                  {AUTH_BUTTON_TEXT.github}
                  {renderLastUsedBadge("github")}
                </>
              )}
            </Button>
            <p id="github-description" className="sr-only">
              Sign in with your GitHub account
            </p>

            <Button
              variant="outline"
              type="button"
              className="relative w-full"
              onClick={() => handleSocialSignIn("google")}
              disabled={isPending}
              aria-describedby="google-description"
            >
              {isLoading("google") ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  {LOADING_MESSAGES.google}
                </>
              ) : (
                <>
                  <Google className="mr-2 size-5" />
                  {AUTH_BUTTON_TEXT.google}
                  {renderLastUsedBadge("google")}
                </>
              )}
            </Button>
            <p id="google-description" className="sr-only">
              Sign in with your Google account
            </p>
          </div>
        </div>
      </form>

      {/* Terms */}
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
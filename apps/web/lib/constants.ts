const AUTH_ERROR_MESSAGES = {
  invalid_email: "Please enter a valid email address",
  user_not_found: "No account found with this email",
  rate_limited: "Too many attempts. Please try again later",
  network_error: "Network error. Please check your connection",
  passkey_not_supported:
    "Passkey authentication is not supported on this device",
  cancelled: "Authentication was cancelled",
} as const;

const LOADING_MESSAGES = {
  magicLink: "Sending magic link...",
  passkey: "Authenticating...",
  github: "Connecting...",
  google: "Connecting...",
} as const;

const AUTH_BUTTON_TEXT = {
  magicLink: "Sign in with Magic Link",
  passkey: "Sign in with Passkey",
  github: "GitHub",
  google: "Google",
} as const;

export { AUTH_ERROR_MESSAGES, LOADING_MESSAGES, AUTH_BUTTON_TEXT };

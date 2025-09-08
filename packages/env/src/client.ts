import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
 
export const env = createEnv({
  clientPrefix: "PUBLIC_",
  client: {
    PUBLIC_NEXT_PUBLIC_SERVER_URL: z.string().min(1),
  },
  runtimeEnv: process.env,
});
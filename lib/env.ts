import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";


export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    JWT_SECRET: z.string().min(1).optional().default("dev_jwt_secret"),
    REDIS_URL: z.string().min(1).optional().default("redis://localhost:6379"),
    REDIS_TOKEN: z.string().min(1).optional().default("dev_token"),
    NEYNAR_API_KEY: z.string().optional(),
    BASESCAN_API_KEY_1: z.string().optional(),
    BASESCAN_API_KEY_2: z.string().optional(),
    BASESCAN_API_KEY_3: z.string().optional(),
    BASESCAN_API_KEY_4: z.string().optional(),
  },

client: {
    NEXT_PUBLIC_URL: z.string().min(1).optional().default("https://baseanalizer.vercel.app"),
    NEXT_PUBLIC_APP_ENV: z
      .enum(["development", "production"])
      .optional()
      .default("development"),
    NEXT_PUBLIC_FARCASTER_HEADER: z.string().min(1).optional().default("dev_header"),
    NEXT_PUBLIC_FARCASTER_PAYLOAD: z.string().min(1).optional().default("dev_payload"),
    NEXT_PUBLIC_FARCASTER_SIGNATURE: z.string().min(1).optional().default("dev_signature"),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_TOKEN: process.env.REDIS_TOKEN,
    NEYNAR_API_KEY: process.env.NEYNAR_API_KEY,
    BASESCAN_API_KEY_1: process.env.BASESCAN_API_KEY_1,
    BASESCAN_API_KEY_2: process.env.BASESCAN_API_KEY_2,
    BASESCAN_API_KEY_3: process.env.BASESCAN_API_KEY_3,
    BASESCAN_API_KEY_4: process.env.BASESCAN_API_KEY_4,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_FARCASTER_HEADER: process.env.NEXT_PUBLIC_FARCASTER_HEADER,
    NEXT_PUBLIC_FARCASTER_PAYLOAD: process.env.NEXT_PUBLIC_FARCASTER_PAYLOAD,
    NEXT_PUBLIC_FARCASTER_SIGNATURE: process.env.NEXT_PUBLIC_FARCASTER_SIGNATURE,
  },

});

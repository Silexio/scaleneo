import { defineCloudflareConfig, type OpenNextConfig } from "@opennextjs/cloudflare";

const config = {
  ...defineCloudflareConfig(),
  buildCommand: "next build",
} satisfies OpenNextConfig;

export default config;

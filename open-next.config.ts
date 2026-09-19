import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = {
  ...defineCloudflareConfig(),
  buildCommand: "next build",
};

export default config;

import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",

  timeout: 60_000,

  retries: process.env.CI ? 2 : 0,

  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : "html",

  use: {
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
});

import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: 'tests/e2e/**/*.cy.{js,ts,jsx,tsx}',
    baseUrl: process.env.PUBLIC_BASE_URL || 'http://localhost:3000',
    supportFile: false
  },
});

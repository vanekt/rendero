import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  root: ".",
  server: {
    port: 3000,
  },
  plugins: [solid({ include: /solid\.tsx$/ }), svelte()],
});

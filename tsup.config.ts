import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/http/index.ts"],
  clean: true,
  format: ["cjs", "esm"],
  dts: true,
  tsconfig: "tsconfig.json",
  sourcemap: true,
  splitting: false,
});

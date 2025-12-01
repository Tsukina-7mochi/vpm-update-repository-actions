import * as esbuild from "esbuild";
import { denoPlugin } from "@deno/esbuild-plugin";

await esbuild.build({
  entryPoints: ["src/main.ts"],
  outfile: "dist/index.js",
  platform: "node",
  target: "node20",
  bundle: true,
  minify: true,
  treeShaking: true,
  sourcemap: "inline",
  plugins: [denoPlugin()],
});

await esbuild.stop();

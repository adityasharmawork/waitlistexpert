import * as esbuild from "esbuild";

async function build() {
  const result = await esbuild.build({
    entryPoints: ["widget/src/index.ts"],
    bundle: true,
    minify: true,
    format: "iife",
    target: ["es2020"],
    outfile: "widget/dist/widget.js",
    metafile: true,
  });

  const text = await esbuild.analyzeMetafile(result.metafile);
  console.log(text);

  // Check size
  const fs = await import("fs");
  const stats = fs.statSync("widget/dist/widget.js");
  const sizeKB = (stats.size / 1024).toFixed(1);
  console.log(`\nWidget size: ${sizeKB} KB`);
  if (stats.size > 5120) {
    console.warn("⚠ Widget exceeds 5KB target!");
  } else {
    console.log("✓ Under 5KB target");
  }
}

build().catch(console.error);

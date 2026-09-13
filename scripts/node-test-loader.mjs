// Minimal ESM resolve hook used ONLY for running route.test.ts directly via
// `node --experimental-strip-types --test`, outside of Next's own bundler.
// Next.js resolves `@/*` path aliases and extensionless `next/*` subpath
// imports itself at build/dev time; plain Node's ESM resolver does neither,
// so this hook bridges the gap for the test runner only.
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const target = pathToFileURL(
      path.resolve(process.cwd(), "src", specifier.slice(2) + ".ts"),
    ).href;
    return nextResolve(target, context);
  }

  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (err?.code === "ERR_MODULE_NOT_FOUND" && !/\.(js|ts|tsx)$/.test(specifier)) {
      for (const ext of [".js", ".ts", ".tsx"]) {
        try {
          return await nextResolve(`${specifier}${ext}`, context);
        } catch (extErr) {
          if (extErr?.code !== "ERR_MODULE_NOT_FOUND") throw extErr;
        }
      }
    }
    throw err;
  }
}

// Node's built-in type-stripping (--experimental-strip-types) only knows
// about the .ts extension; the site's work-content data files use .tsx
// (no actual JSX in them) purely for TS module resolution. Strip and load
// those manually so they resolve like any other TypeScript module.
export async function load(url, context, nextLoad) {
  if (url.endsWith(".tsx")) {
    const source = await readFile(fileURLToPath(url), "utf8");
    const stripped = stripTypeScriptTypes(source, { mode: "strip" });
    return { format: "module", shortCircuit: true, source: stripped };
  }
  return nextLoad(url, context);
}

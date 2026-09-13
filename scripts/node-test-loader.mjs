// Minimal ESM resolve hook used ONLY for running route.test.ts directly via
// `node --experimental-strip-types --test`, outside of Next's own bundler.
// Next.js resolves `@/*` path aliases and extensionless `next/*` subpath
// imports itself at build/dev time; plain Node's ESM resolver does neither,
// so this hook bridges the gap for the test runner only.
import path from "node:path";
import { pathToFileURL } from "node:url";

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
    if (err?.code === "ERR_MODULE_NOT_FOUND" && !specifier.endsWith(".js")) {
      return nextResolve(`${specifier}.js`, context);
    }
    throw err;
  }
}

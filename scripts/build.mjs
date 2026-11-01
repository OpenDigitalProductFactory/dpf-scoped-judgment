import assert from "node:assert/strict";
import { readFile, lstat, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
assert.equal(process.version, "v24.16.0", "Use the declared build toolchain");
const compiler = JSON.parse(await readFile(join(root, "node_modules/typescript/package.json"), "utf8"));
assert.equal(compiler.version, "6.0.3", "Use the pinned compiler");
const dist = join(root, "dist");
const current = await lstat(dist).catch(error => { if (error.code !== "ENOENT") throw error; });
assert(!current?.isSymbolicLink(), "Build output cannot redirect into another project");
await rm(dist, { recursive: true, force: true });
const configPath = join(root, "tsconfig.build.json");
const config = ts.readConfigFile(configPath, ts.sys.readFile);
assert(!config.error, "Read the declared compiler configuration");
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
assert.equal(parsed.errors.length, 0, "Parse the declared compiler configuration");
const program = ts.createProgram(parsed.fileNames, parsed.options);
// TypeScript rewrites runtime imports, but leaves explicit .ts specifiers in
// declarations. Rewrite only declaration import/export nodes; the original
// source and its provenance remain unchanged.
const declarations = context => {
  const rewrite = node => ts.isStringLiteral(node) && node.text.startsWith(".") && node.text.endsWith(".ts")
    ? context.factory.createStringLiteral(node.text.slice(0, -3) + ".js") : node;
  const visit = node => {
    if (ts.isImportDeclaration(node)) return context.factory.updateImportDeclaration(node,
      node.modifiers, node.importClause, rewrite(node.moduleSpecifier), node.attributes);
    if (ts.isExportDeclaration(node) && node.moduleSpecifier) return context.factory.updateExportDeclaration(node,
      node.modifiers, node.isTypeOnly, node.exportClause, rewrite(node.moduleSpecifier), node.attributes);
    if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteral(node.argument.literal)) {
      return context.factory.updateImportTypeNode(node, context.factory.createLiteralTypeNode(rewrite(node.argument.literal)),
        node.attributes, node.qualifier, node.typeArguments, node.isTypeOf);
    }
    return ts.visitEachChild(node, visit, context);
  };
  return source => ts.visitNode(source, visit);
};
const emitted = program.emit(undefined, undefined, undefined, undefined, { afterDeclarations: [declarations] });
const diagnostics = [...ts.getPreEmitDiagnostics(program), ...emitted.diagnostics];
if (diagnostics.length) process.stderr.write(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
  getCanonicalFileName: path => path, getCurrentDirectory: () => root, getNewLine: () => "\n",
}));
assert(!emitted.emitSkipped && diagnostics.every(item => item.category !== ts.DiagnosticCategory.Error),
  "Build the complete portable dependency closure");

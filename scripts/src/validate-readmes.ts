import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import { red, green, orange } from "./utils.js";

const CATEGORIES = ["bundlers", "module-federation", "frameworks", "server", "build-systems"];
const ROOT_PATH = join(__dirname, "../..");

const ALLOWED = {
  framework: ["react", "angular", "solid", "svelte", "ember", "astro", "tanstack", "nitro", "qwik", "vue"],
  bundler: ["vite", "webpack", "rspack", "rsbuild", "rollup", "rolldown", "metro", "repack", "turbopack", "parcel", "tsdown", "nitro"],
  features: ["module-federation", "ssr", "ssg", "edge", "monorepo", "typescript"],
  complexity: ["beginner", "intermediate", "advanced"],
};

const REQUIRED_FIELDS = ["name", "slug", "description", "framework", "bundler", "complexity"] as const;

interface FrontMatter {
  name?: string;
  slug?: string;
  description?: string;
  framework?: string;
  bundler?: string;
  features?: string[];
  complexity?: string;
}

function parseFrontMatter(content: string): FrontMatter | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  return yaml.load(match[1]) as FrontMatter;
}

let errors = 0;
let warnings = 0;

function error(path: string, msg: string): void {
  console.log(`${red("ERROR")} ${path}: ${msg}`);
  errors++;
}

function warn(path: string, msg: string): void {
  console.log(`${orange("WARN")}  ${path}: ${msg}`);
  warnings++;
}

for (const category of CATEGORIES) {
  const categoryPath = join(ROOT_PATH, category);
  if (!existsSync(categoryPath)) continue;

  const examples = readdirSync(categoryPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const example of examples) {
    const examplePath = `${category}/${example}`;
    const readmePath = join(categoryPath, example, "README.md");
    const packagePath = join(categoryPath, example, "package.json");

    // Check README exists
    if (!existsSync(readmePath)) {
      error(examplePath, "missing README.md");
      continue;
    }

    // Check front matter
    const content = readFileSync(readmePath, "utf-8");
    const fm = parseFrontMatter(content);
    if (!fm) {
      error(examplePath, "README.md has no YAML front matter");
      continue;
    }

    // Check required fields
    for (const field of REQUIRED_FIELDS) {
      if (!fm[field]) {
        error(examplePath, `missing required field: ${field}`);
      }
    }

    // Check slug matches path
    if (fm.slug && fm.slug !== examplePath) {
      error(examplePath, `slug "${fm.slug}" does not match path "${examplePath}"`);
    }

    // Check allowed values
    if (fm.framework && !ALLOWED.framework.includes(fm.framework)) {
      error(examplePath, `invalid framework: "${fm.framework}"`);
    }
    if (fm.bundler && !ALLOWED.bundler.includes(fm.bundler)) {
      error(examplePath, `invalid bundler: "${fm.bundler}"`);
    }
    if (fm.complexity && !ALLOWED.complexity.includes(fm.complexity)) {
      error(examplePath, `invalid complexity: "${fm.complexity}"`);
    }
    if (fm.features) {
      for (const f of fm.features) {
        if (!ALLOWED.features.includes(f)) {
          error(examplePath, `invalid feature: "${f}"`);
        }
      }
    }

    // Check package.json has dev and build scripts
    if (existsSync(packagePath)) {
      const pkg = JSON.parse(readFileSync(packagePath, "utf-8"));
      if (!pkg.scripts?.build) {
        warn(examplePath, "package.json missing 'build' script");
      }
      if (!pkg.scripts?.dev) {
        warn(examplePath, "package.json missing 'dev' script");
      }
    }
  }
}

// Check templates.json is up to date
const templatesPath = join(ROOT_PATH, "templates.json");
if (!existsSync(templatesPath)) {
  error("templates.json", "file does not exist — run 'pnpm generate-templates'");
}

console.log(`\n${errors === 0 ? green("PASS") : red("FAIL")} — ${errors} error(s), ${warnings} warning(s)`);
process.exit(errors > 0 ? 1 : 0);

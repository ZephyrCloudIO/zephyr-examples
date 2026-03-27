import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";

const CATEGORIES = ["bundlers", "module-federation", "frameworks", "server", "build-systems"];
const ROOT_PATH = join(__dirname, "../..");
const OUTPUT_PATH = join(ROOT_PATH, "templates.json");

interface FrontMatter {
  name: string;
  slug: string;
  description: string;
  framework: string;
  bundler: string;
  features: string[];
  complexity: string;
}

interface TemplateEntry extends FrontMatter {
  path: string;
}

function parseFrontMatter(content: string): FrontMatter | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  return yaml.load(match[1]) as FrontMatter;
}

function discoverTemplates(): TemplateEntry[] {
  const templates: TemplateEntry[] = [];

  for (const category of CATEGORIES) {
    const categoryPath = join(ROOT_PATH, category);
    if (!existsSync(categoryPath)) continue;

    const examples = readdirSync(categoryPath, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();

    for (const example of examples) {
      const readmePath = join(categoryPath, example, "README.md");
      if (!existsSync(readmePath)) {
        console.warn(`Warning: no README.md in ${category}/${example}`);
        continue;
      }

      const content = readFileSync(readmePath, "utf-8");
      const fm = parseFrontMatter(content);
      if (!fm) {
        console.warn(`Warning: no front matter in ${category}/${example}/README.md`);
        continue;
      }

      templates.push({
        ...fm,
        features: fm.features ?? [],
        path: `${category}/${example}`,
      });
    }
  }

  return templates;
}

const templates = discoverTemplates();
writeFileSync(OUTPUT_PATH, JSON.stringify(templates, null, 2) + "\n");
console.log(`Generated templates.json with ${templates.length} entries`);

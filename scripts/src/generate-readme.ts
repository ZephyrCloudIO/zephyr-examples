import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT_PATH = join(__dirname, "../..");
const TEMPLATES_PATH = join(ROOT_PATH, "templates.json");
const README_PATH = join(ROOT_PATH, "README.md");

interface TemplateEntry {
  name: string;
  slug: string;
  description: string;
  framework: string;
  bundler: string;
  features: string[];
  complexity: string;
  path: string;
}

const CATEGORY_LABELS: Record<string, { title: string; description: string }> = {
  bundlers: {
    title: "Bundlers",
    description: "Zephyr Cloud integrated with different bundlers — no Module Federation.",
  },
  "module-federation": {
    title: "Module Federation",
    description: "Micro-frontend architecture with Module Federation, Zephyr's core value proposition.",
  },
  frameworks: {
    title: "Frameworks",
    description: "Non-React frameworks, meta-frameworks, and React Native.",
  },
  server: {
    title: "Server",
    description: "Server-side and edge runtime examples.",
  },
  "build-systems": {
    title: "Build Systems",
    description: "Monorepo build system integrations.",
  },
};

const CATEGORY_ORDER = ["bundlers", "module-federation", "frameworks", "server", "build-systems"];

function generateReadme(templates: TemplateEntry[]): string {
  const grouped = new Map<string, TemplateEntry[]>();
  for (const t of templates) {
    const category = t.path.split("/")[0];
    if (!grouped.has(category)) grouped.set(category, []);
    grouped.get(category)!.push(t);
  }

  const lines: string[] = [
    "# Zephyr Cloud Examples",
    "",
    "Starter projects and reference examples for [Zephyr Cloud](https://zephyr-cloud.io).",
    "",
    "> **Quick start:** `npx degit ZephyrCloudIO/zephyr-examples/{slug} my-app` to scaffold any example.",
    "",
  ];

  for (const category of CATEGORY_ORDER) {
    const entries = grouped.get(category);
    if (!entries || entries.length === 0) continue;

    const label = CATEGORY_LABELS[category];
    lines.push(`## ${label.title}`);
    lines.push("");
    lines.push(label.description);
    lines.push("");
    lines.push("| Example | Framework | Bundler | Complexity |");
    lines.push("|---------|-----------|---------|------------|");

    for (const entry of entries) {
      const link = `[${entry.name}](${entry.path})`;
      lines.push(`| ${link} | ${entry.framework} | ${entry.bundler} | ${entry.complexity} |`);
    }

    lines.push("");
  }

  lines.push("## Learn More");
  lines.push("");
  lines.push("- [Zephyr Cloud Docs](https://docs.zephyr-cloud.io)");
  lines.push("- [Zephyr Cloud Dashboard](https://app.zephyr-cloud.io)");
  lines.push("");

  return lines.join("\n");
}

const templates: TemplateEntry[] = JSON.parse(readFileSync(TEMPLATES_PATH, "utf-8"));
const readme = generateReadme(templates);
writeFileSync(README_PATH, readme);
console.log(`Generated README.md with ${templates.length} examples`);

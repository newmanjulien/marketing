import { homeIndustries } from "$lib/marketing/home/homeIndustries";
import type { IndustryId } from "$lib/marketing/industries/industryContent";

export type TextMessageScenario = {
  id: string;
  label: string; // dropdown label
  message: string; // message body (whitespace preserved)
  description: string; // caption sentence, no trailing period
};

// Content lives as one Markdown file per scenario under
// src/content/home/text-message/<industry>/<order>-<id>.md
// so anyone can edit the copy as plain text. Each file has a small frontmatter
// block (label, description) followed by the message body.
const files = import.meta.glob(
  "/src/content/home/text-message/*/*.md",
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

type ParsedScenario = TextMessageScenario & { industry: string; order: number };

function parseFrontmatter(raw: string): { label: string; description: string; body: string } {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(raw);
  if (!match) {
    throw new Error("text-message content file is missing its frontmatter block");
  }

  const fields: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    fields[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }

  const { label, description } = fields;
  if (!label || !description) {
    throw new Error("text-message content file must define both `label` and `description`");
  }

  return { label, description, body: raw.slice(match[0].length).trim() };
}

function parseFile(path: string, raw: string): ParsedScenario {
  const match = /\/([^/]+)\/(\d+)-(.+)\.md$/.exec(path);
  if (!match) {
    throw new Error(`text-message file must be named "<industry>/<order>-<id>.md": ${path}`);
  }
  const [, industry, order, id] = match;

  const { label, description, body } = parseFrontmatter(raw);
  return { industry, order: Number(order), id, label, description, message: body };
}

const scenariosByIndustry = new Map<string, ParsedScenario[]>();
for (const [path, raw] of Object.entries(files)) {
  const scenario = parseFile(path, raw);
  const list = scenariosByIndustry.get(scenario.industry) ?? [];
  list.push(scenario);
  scenariosByIndustry.set(scenario.industry, list);
}

// Order industries by the canonical home list, and scenarios by their filename
// prefix, so the tabs and dropdown match the source layout.
export const textMessageScenariosByIndustryId = Object.fromEntries(
  homeIndustries.map((industry): [IndustryId, readonly TextMessageScenario[]] => {
    const scenarios = scenariosByIndustry.get(industry.id);
    if (!scenarios?.length) {
      throw new Error(
        `No text-message content found for industry "${industry.id}". ` +
          `Add at least one file under src/content/home/text-message/${industry.id}/`,
      );
    }

    const sorted = scenarios
      .sort((a, b) => a.order - b.order)
      .map(({ id, label, message, description }) => ({ id, label, message, description }));

    return [industry.id, sorted];
  }),
) as Record<IndustryId, readonly TextMessageScenario[]>;

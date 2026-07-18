import { homeIndustries, type HomeIndustryId } from "$lib/home/industryContent";

export type OpportunityScenario = {
  id: string;
  label: string; // dropdown label
  email: string; // email body (whitespace preserved)
  description: string; // caption sentence, no trailing period
};

export type OpportunityIndustryContent = {
  scenarios: readonly [OpportunityScenario, ...OpportunityScenario[]]; // non-empty
};

// Content lives as one Markdown file per scenario under
// src/content/home/opportunity-email/<industry>/<order>-<id>.md
// so anyone can edit the copy as plain text. Each file has a small frontmatter
// block (label, description) followed by the email body.
const files = import.meta.glob(
  "/src/content/home/opportunity-email/*/*.md",
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

type ParsedScenario = OpportunityScenario & { industry: string; order: number };

function parseFrontmatter(raw: string): { label: string; description: string; body: string } {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(raw);
  if (!match) {
    throw new Error("opportunity-email content file is missing its frontmatter block");
  }

  const fields: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    if (!line.trim()) continue;
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    fields[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }

  const { label, description } = fields;
  if (!label || !description) {
    throw new Error("opportunity-email content file must define both `label` and `description`");
  }

  return { label, description, body: raw.slice(match[0].length).trim() };
}

function parseFile(path: string, raw: string): ParsedScenario {
  const match = /\/([^/]+)\/(\d+)-(.+)\.md$/.exec(path);
  if (!match) {
    throw new Error(`opportunity-email file must be named "<industry>/<order>-<id>.md": ${path}`);
  }
  const [, industry, order, id] = match;

  const { label, description, body } = parseFrontmatter(raw);
  return { industry, order: Number(order), id, label, description, email: body };
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
export const opportunityContentByIndustryId = {} as Record<
  HomeIndustryId,
  OpportunityIndustryContent
>;
for (const industry of homeIndustries) {
  const scenarios = scenariosByIndustry.get(industry.id);
  if (!scenarios || scenarios.length === 0) {
    throw new Error(
      `No opportunity-email content found for industry "${industry.id}". ` +
        `Add at least one file under src/content/home/opportunity-email/${industry.id}/`,
    );
  }

  const sorted = scenarios
    .sort((a, b) => a.order - b.order)
    .map(({ id, label, email, description }) => ({ id, label, email, description }));

  opportunityContentByIndustryId[industry.id] = {
    scenarios: sorted as [OpportunityScenario, ...OpportunityScenario[]],
  };
}

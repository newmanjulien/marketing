export const meta = {
  name: 'audit-diff',
  description: 'Critique the working-tree diff vs the last commit, then re-judge each critique with fresh eyes',
  whenToUse: 'Invoked by the /audit skill. Read-only: proposes and recommends, never edits.',
  phases: [
    { title: 'Critique', detail: 'critics split the changed files and review the diff' },
    { title: 'Fresh eyes', detail: 'a fresh reviewer re-judges each critic\'s proposals' },
  ],
}

// args = { files: [changed file paths vs HEAD] }
// The runtime may hand `args` over as a JSON string, so normalise to an object.
const opts = typeof args === 'string' ? JSON.parse(args) : args
const files = (opts?.files ?? []).filter(Boolean)
if (!files.length) {
  log('No changed files vs HEAD — nothing to audit.')
  return { recommendations: [], note: 'clean working tree' }
}

// Split the changed files into up to 5 balanced groups, one critic each.
const N = Math.min(5, files.length)
const groups = Array.from({ length: N }, () => [])
files.forEach((f, i) => groups[i % N].push(f))

const CATEGORIES = ['disagree', 'mistake', 'sloppiness', 'shorter', 'mental-model']

const PROPOSALS = {
  type: 'object',
  additionalProperties: false,
  properties: {
    proposals: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          file: { type: 'string' },
          lines: { type: 'string' },
          category: { type: 'string', enum: CATEGORIES },
          issue: { type: 'string', description: 'What in this change you take issue with and why' },
          suggestion: { type: 'string', description: 'What you would do instead (do NOT apply it)' },
        },
        required: ['file', 'lines', 'category', 'issue', 'suggestion'],
      },
    },
  },
  required: ['proposals'],
}

const RECS = {
  type: 'object',
  additionalProperties: false,
  properties: {
    recommendations: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          file: { type: 'string' },
          lines: { type: 'string' },
          category: { type: 'string', enum: CATEGORIES },
          issue: { type: 'string' },
          suggestion: { type: 'string' },
          recommend: { type: 'boolean', description: 'Whether this is worth acting on' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          reasoning: { type: 'string', description: 'Your fresh-eyes judgement from re-reading the diff' },
        },
        required: ['file', 'lines', 'category', 'issue', 'suggestion', 'recommend', 'priority', 'reasoning'],
      },
    },
  },
  required: ['recommendations'],
}

const critiquePrompt = (group) => `You are reviewing changes made in the working tree versus the last commit (HEAD). Inspect ONLY these changed files:

${group.map((f) => `  - ${f}`).join('\n')}

For each, run \`git diff HEAD -- <file>\` and read enough surrounding code to judge the change in context. Then look for:
- changes you disagree with (category "disagree")
- mistakes or bugs introduced (category "mistake")
- sloppiness — dead code, leftovers, inconsistency, poor naming (category "sloppiness")
- code that could be shorter without losing clarity (category "shorter")
- code whose mental model could be clearer (category "mental-model")

Lots of small real gains are fine; churn is acceptable if each gain is genuine. It's equally fine to find nothing — do not invent issues. Do NOT edit anything. Return the PROPOSALS structured object (empty array if the diff looks good).`

const freshEyesPrompt = (batch) => `You are a fresh, skeptical reviewer. Another agent critiqued the working-tree diff and produced the proposals below. Do NOT trust them — re-run \`git diff HEAD -- <file>\` for each and judge from the actual change.

Proposals:
${JSON.stringify(batch.proposals, null, 2)}

For each, decide recommend=true only if it is a real, worthwhile improvement to the change (not preference, not a fight with repo conventions, not already fine as written). Set priority and give your reasoning from what you actually saw. Do NOT edit anything. Return the RECS structured object.`

// Pipeline: each critic's proposals go straight to a fresh reviewer, no barrier.
const judged = await pipeline(
  groups,
  (group, _g, i) => agent(critiquePrompt(group), { label: `critique:g${i + 1}`, phase: 'Critique', schema: PROPOSALS }),
  (batch, _group, i) => {
    if (!batch || !batch.proposals?.length) return { recommendations: [] }
    return agent(freshEyesPrompt(batch), { label: `fresh-eyes:g${i + 1}`, phase: 'Fresh eyes', schema: RECS })
  },
)

const recs = judged.filter(Boolean).flatMap((r) => r.recommendations)
const keep = recs.filter((r) => r.recommend)

log(`audit: ${recs.length} proposals judged → ${keep.length} recommended`)

return { recommended: keep, notRecommended: recs.filter((r) => !r.recommend) }

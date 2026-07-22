export const meta = {
  name: 'sweep-find-and-review',
  description: 'Fan out finders across the codebase for one lens, then critically review each batch',
  whenToUse: 'Invoked by the /sweep, /sweep-full and /sweep-short skills once per pass. Returns reviewed findings; it does NOT apply anything.',
  phases: [
    { title: 'Find', detail: '5 finders, each picks a section and finds up to N issues' },
    { title: 'Review', detail: 'a fresh skeptic reviews each finder\'s batch' },
  ],
}

// Single source of truth for every sweep lens. Skills pass only { lens } and the
// count + briefs are looked up here, so bugs/taste/short/etc. are defined once.
const PASSES = {
  bugs: {
    count: 1,
    finderBrief:
      'Hunt for real correctness bugs — logic errors, wrong conditions, off-by-one, unhandled null/undefined, race conditions, incorrect state transitions, misuse of an API, security holes. A bug produces wrong behaviour, not merely ugly code. Find at most ONE, your best one.',
    reviewerBrief:
      'Be ruthless. Most "bugs" finders report are not real. Reject anything you cannot trace to concrete wrong behaviour with specific inputs/state. Confirm only genuine defects.',
  },
  taste: {
    count: 3,
    finderBrief:
      'Find small things that would put off a senior dev reading this code — awkward naming, muddled abstractions, inconsistent patterns, dead code, confusing control flow, misleading comments, style issues. Style-level findings are welcome. Lots of small real gains are fine; churn is acceptable if each gain is genuine.',
    reviewerBrief:
      'Confirm findings a senior dev would actually agree improve the code. Reject nitpicks that are pure preference, fight existing repo conventions, or trade one taste for another. Respect the project rules: prefer deletion over new abstraction, and don\'t invent generic helpers/components.',
  },
  short: {
    count: 3,
    finderBrief:
      'Find lines/blocks that could be written shorter WITHOUT losing clarity — redundant intermediate variables, verbose conditionals collapsible to an expression, manual loops that are a one-line array method, dead branches, needless destructuring/re-wrapping. Do NOT propose big structural refactors and do NOT create new components. Small real wins only.',
    reviewerBrief:
      'Confirm only where the shorter version is at least as readable as the original. Reject anything that saves characters at the cost of clarity, or that is a structural change / new component rather than a local tightening.',
  },
  'delete-components': {
    count: 3,
    finderBrief:
      'Find places where a component exists but shouldn\'t — used in only one place, adds indirection without earning it, wraps a trivial bit of markup, or exists only to pass props straight through. The fix is to flatten it: inline it into its single caller and delete the file. Churn is fine if the gain is real. Do NOT flag components that are genuinely reused or encapsulate real complexity.',
    reviewerBrief:
      'Confirm only where inlining genuinely simplifies — one caller (or trivial ones), no real logic, and flattening removes indirection without bloating the caller. Reject anything reused in multiple places or where the component is load-bearing for readability. Respect the project preference for deletion over abstraction.',
  },
  svelte: {
    count: 3,
    finderBrief:
      'Find places that could make better use of Svelte / SvelteKit idioms — Svelte 5 runes ($state/$derived/$effect/$props) over older patterns, reactive statements that should be $derived, manual store plumbing a rune would replace, awkward use of load functions / form actions / server endpoints, missing {#await}, class:/style: directives, bind: shorthands, snippets over slots where apt. Syntax and code-level changes only. Style issues welcome. No big structural rework.',
    reviewerBrief:
      'Confirm changes a Svelte-fluent dev would agree are more idiomatic and at least as clear, and that match the versions/patterns already used in this repo. Reject anything that fights the repo\'s established conventions, is purely cosmetic with no idiom gain, or is a structural rework rather than a code-level change.',
  },
}

// args = { lens } — the pass to run. (finderBrief/reviewerBrief/count may be passed to override.)
// The runtime may hand `args` over as a JSON string, so normalise to an object.
const opts = typeof args === 'string' ? JSON.parse(args) : args
const lens = opts.lens
const pass = PASSES[lens]
if (!pass) throw new Error(`Unknown sweep lens: ${lens}. Known: ${Object.keys(PASSES).join(', ')}`)
const count = opts.count ?? pass.count
const finderBrief = opts.finderBrief ?? pass.finderBrief
const reviewerBrief = opts.reviewerBrief ?? pass.reviewerBrief

// Deterministic zones so the 5 finders spread out instead of piling on the same files.
// Each finder still picks its own section *within* its zone, so there's real variety run-to-run.
const ZONES = [
  'convex/ — the backend: schema, queries, mutations, model/, auth, crons, email',
  'src/lib/success-room/ — the success-room feature: domain/, persistence/, pages/, shell/, kickoff-schedule/',
  'src/lib/marketing/ — the marketing site components and industry data modules',
  'src/lib/ui/ + src/routes/ + src/params/ — shared UI, route handlers, param matchers',
  'shared/ + scripts/ + src/content/ + root config (svelte.config.js, vite.config.ts, tailwind.config.ts, hooks.server.ts)',
]

const FINDINGS = {
  type: 'object',
  additionalProperties: false,
  properties: {
    section: { type: 'string', description: 'The specific files/area you actually inspected' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          file: { type: 'string' },
          lines: { type: 'string', description: 'Line range, e.g. "42-55"' },
          title: { type: 'string', description: 'One-line statement of the issue' },
          detail: { type: 'string', description: 'What is wrong and why it matters' },
          fix: { type: 'string', description: 'The concrete change to make' },
        },
        required: ['file', 'lines', 'title', 'detail', 'fix'],
      },
    },
  },
  required: ['section', 'findings'],
}

const VERDICTS = {
  type: 'object',
  additionalProperties: false,
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          file: { type: 'string' },
          lines: { type: 'string' },
          title: { type: 'string' },
          verdict: { type: 'string', enum: ['CONFIRMED', 'REJECTED'] },
          confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
          note: { type: 'string', description: 'Why you confirmed or rejected, from your own reading of the code' },
          fix: { type: 'string', description: 'The fix to apply (refine the finder\'s if needed)' },
        },
        required: ['file', 'lines', 'title', 'verdict', 'confidence', 'note', 'fix'],
      },
    },
  },
  required: ['verdicts'],
}

const finderPrompt = (zone, i) => `You are finder ${i + 1} of 5 in a "${lens}" sweep of this codebase.

Focus your search on this zone:
  ${zone}

Pick a section within that zone that looks interesting and read it properly. ${finderBrief}

Find UP TO ${count} issue(s) — quality over quantity. If the section is clean, look at an adjacent file in your zone rather than forcing weak findings. Report zero rather than padding.

For each finding give the exact file, line range, a one-line title, why it matters, and the concrete fix. Return the FINDINGS structured object.`

const reviewerPrompt = (batch) => `You are a fresh, skeptical reviewer in a "${lens}" sweep. Another agent produced the findings below. Do NOT trust them — open the referenced files yourself and judge each one on its own merits.

${reviewerBrief}

Findings to review:
${JSON.stringify(batch.findings, null, 2)}

For each finding: read the actual code, then return CONFIRMED (real, worth doing, fix is sound) or REJECTED (wrong, not worth the churn, or fix is misguided). Set confidence and explain your reasoning from what you saw. If the finder's fix is right but incomplete, improve it in the \`fix\` field. Return the VERDICTS structured object.`

// Pipeline: each finder's batch flows straight into its own reviewer — no barrier,
// so a clean finder gets reviewed while a slow finder is still reading.
const reviewed = await pipeline(
  ZONES,
  (zone, _z, i) => agent(finderPrompt(zone, i), { label: `find:zone${i + 1}`, phase: 'Find', schema: FINDINGS }),
  (batch, _zone, i) => {
    if (!batch || !batch.findings?.length) return { verdicts: [] }
    return agent(reviewerPrompt(batch), { label: `review:zone${i + 1}`, phase: 'Review', schema: VERDICTS })
  },
)

const verdicts = reviewed.filter(Boolean).flatMap((r) => r.verdicts)
const confirmed = verdicts.filter((v) => v.verdict === 'CONFIRMED')

log(`${lens}: ${verdicts.length} reviewed → ${confirmed.length} confirmed, ${verdicts.length - confirmed.length} rejected`)

return { lens, confirmed, rejected: verdicts.filter((v) => v.verdict === 'REJECTED') }

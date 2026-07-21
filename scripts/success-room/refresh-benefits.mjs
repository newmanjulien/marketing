import { readBenefitCards } from "./helpers/benefit-cards.mjs";
import { runConvex } from "./helpers/convex.mjs";

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: npm run refresh:success-room:benefits -- <room-slug>");
  process.exit(1);
}

const benefitCards = await readBenefitCards(import.meta.dirname);

await runConvex("admin:replaceSuccessRoomBenefitCards", {
  slug,
  benefitCards,
});

console.log(`Refreshed benefit cards for ${slug}.`);

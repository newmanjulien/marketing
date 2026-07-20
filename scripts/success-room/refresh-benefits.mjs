import { readBenefitCards } from "./helpers/benefit-cards.mjs";
import { runConvex } from "./helpers/convex.mjs";

const slug = "overbase";
const benefitCards = await readBenefitCards(import.meta.dirname);

await runConvex("admin:replaceSuccessRoomBenefitCards", {
  slug,
  benefitCards,
});

console.log(`Refreshed benefit cards for ${slug}.`);

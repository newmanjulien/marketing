import { api } from "../../convex/_generated/api.js";
import { readBenefitCards } from "./helpers/benefit-cards.mjs";
import { createSeedClient } from "./helpers/seed-common.mjs";

const slug = "overbase";
const { client, seedSecret } = await createSeedClient();
const benefitCards = await readBenefitCards(import.meta.dirname);

await client.mutation(api.successRooms.replaceSuccessRoomBenefitCards, {
  seedSecret,
  slug,
  benefitCards,
});

console.log(`Refreshed benefit cards for ${slug}.`);

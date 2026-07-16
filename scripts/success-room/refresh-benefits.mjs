import { api } from "../../convex/_generated/api.js";
import { readBenefitCards } from "./helpers/benefit-cards.mjs";
import { connectToTarget } from "./helpers/convex-client.mjs";

const slug = "overbase";
const { client, seedSecret } = await connectToTarget();
const benefitCards = await readBenefitCards(import.meta.dirname);

await client.mutation(api.successRooms.replaceSuccessRoomBenefitCards, {
  seedSecret,
  slug,
  benefitCards,
});

console.log(`Refreshed benefit cards for ${slug}.`);

import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { createRoomSession } from "./model/auth";
import { roomBySlug } from "./model/rooms";

const normalizeName = (value: string) => value.normalize().trim().toLowerCase();

const lastNameOf = (name: string) => normalizeName(name).split(/\s+/).at(-1) ?? "";

// A room is unlocked by the last name of any current team member. Returns the
// session token, or null when the name matches nobody (the caller can't tell a
// missing room from a wrong name).
export const login = mutation({
  args: {
    slug: v.string(),
    lastName: v.string(),
  },
  handler: async (ctx, args): Promise<string | null> => {
    const candidate = normalizeName(args.lastName);

    if (!candidate) {
      return null;
    }

    const room = await roomBySlug(ctx, args.slug);

    if (!room || !room.teamMembers.some((member) => lastNameOf(member.name) === candidate)) {
      return null;
    }

    return createRoomSession(ctx, room._id);
  },
});

"use node";

import { v } from "convex/values";
import nodemailer from "nodemailer";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

const smtpHost = "mail.privateemail.com";
const smtpPort = 465;

const sender = {
  name: "Julien Newman",
  address: "julien@overbase.app",
} as const;

const htmlEntities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => htmlEntities[character]);

const createDocumentRequestEmail = (
  { slug, prospectName, description, submittedAt }: {
    slug: string;
    prospectName: string;
    description: string;
    submittedAt: number;
  },
  recipient: string,
) => {
  const submittedAtIso = new Date(submittedAt).toISOString();

  return {
    from: sender,
    to: recipient,
    subject: "New Success Room document request",
    text: [
      "A new document was requested in a Success Room.",
      "",
      `Prospect: ${prospectName}`,
      `Success Room slug: ${slug}`,
      `Submitted at: ${submittedAtIso}`,
      "",
      "Description:",
      description,
    ].join("\n"),
    html: [
      "<p>A new document was requested in a Success Room.</p>",
      `<p><strong>Prospect:</strong> ${escapeHtml(prospectName)}<br>`,
      `<strong>Success Room slug:</strong> ${escapeHtml(slug)}<br>`,
      `<strong>Submitted at:</strong> ${escapeHtml(submittedAtIso)}</p>`,
      "<p><strong>Description:</strong></p>",
      `<p>${escapeHtml(description).replace(/\r\n|\r|\n/g, "<br>")}</p>`,
    ].join(""),
  };
};

export const sendDocumentRequestNotification = internalAction({
  args: {
    requestId: v.id("successRoomDocumentRequests"),
    slug: v.string(),
    prospectName: v.string(),
    description: v.string(),
    submittedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const user = process.env.PRIVATE_EMAIL_USER?.trim();
    const password = process.env.PRIVATE_EMAIL_PASSWORD;
    const recipient = process.env.SUCCESS_ROOM_DOCUMENT_REQUEST_RECIPIENT?.trim() || user;

    if (!user || !password || !recipient) {
      throw new Error(
        "Document request email is not configured: set PRIVATE_EMAIL_USER, PRIVATE_EMAIL_PASSWORD, and SUCCESS_ROOM_DOCUMENT_REQUEST_RECIPIENT with npx convex env set",
      );
    }

    const transport = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: true,
      auth: { user, pass: password },
    });

    let notificationStatus: "sent" | "failed";

    try {
      await transport.sendMail(createDocumentRequestEmail(args, recipient));
      notificationStatus = "sent";
    } catch (notificationError) {
      console.error("Unable to email Success Room document request", notificationError);
      notificationStatus = "failed";
    }

    await ctx.runMutation(internal.rooms.markDocumentRequestNotification, {
      requestId: args.requestId,
      notificationStatus,
    });
  },
});

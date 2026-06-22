import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import nodemailer from "nodemailer";
import type { Actions } from "./$types";

const SMTP_HOST = "mail.privateemail.com";
const SMTP_PORT = 465;
const FROM_EMAIL = "julien@overbase.app";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SurveyResultsFailure = {
  email?: string;
  message: string;
};

const getEmail = (value: FormDataEntryValue | null) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

const getSmtpConfig = () => {
  const user = env.PRIVATE_EMAIL_USER?.trim();
  const password = env.PRIVATE_EMAIL_PASSWORD;
  const bcc = env.SURVEY_CONFIRMATION_BCC?.trim();

  if (!user || !password || !bcc) {
    return null;
  }

  return { user, password, bcc };
};

export const actions = {
  surveyResults: async ({ request }) => {
    const formData = await request.formData();
    const email = getEmail(formData.get("email"));

    if (!emailPattern.test(email)) {
      return fail(400, {
        email,
        message: "Enter a valid email address.",
      } satisfies SurveyResultsFailure);
    }

    const smtpConfig = getSmtpConfig();

    if (!smtpConfig) {
      return fail(500, {
        email,
        message: "Email confirmation is not configured yet.",
      } satisfies SurveyResultsFailure);
    }

    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: true,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.password,
      },
    });

    try {
      await transport.sendMail({
        from: {
          name: "Julien Newman",
          address: FROM_EMAIL,
        },
        to: email,
        bcc: smtpConfig.bcc,
        subject: "Survey results confirmation",
        text: [
          "Thank you for your interest our CIO survey.",
          "",
          "I'll send you the results when they're published mid-August.",
          "",
          "julien",
        ].join("\n"),
        html: [
          "<p>Thanks for your interest in the Overbase survey.</p>",
          "<p>I'll send you the results when they're published mid-August.</p>",
          "<p>julien</p>",
        ].join(""),
      });
    } catch {
      return fail(502, {
        email,
        message:
          "Email confirmation could not be sent. Try again in a few minutes",
      } satisfies SurveyResultsFailure);
    }

    return {
      email,
      success: true,
      message:
        "You're on the list. We'll send the results when they're published",
    };
  },
} satisfies Actions;

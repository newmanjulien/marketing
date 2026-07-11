import { env } from '$env/dynamic/private';
import nodemailer from 'nodemailer';
import type { SendMailOptions } from 'nodemailer';

const smtpHost = 'mail.privateemail.com';
const smtpPort = 465;

const privateEmailSender = {
  name: 'Julien Newman',
  address: 'julien@overbase.app'
} as const;

export type PrivateEmailMessage = Omit<SendMailOptions, 'from'>;

export const createPrivateEmailSender = () => {
  const user = env.PRIVATE_EMAIL_USER?.trim();
  const password = env.PRIVATE_EMAIL_PASSWORD;

  if (!user || !password) {
    return null;
  }

  const transport = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: true,
    auth: {
      user,
      pass: password
    }
  });

  return {
    send: (message: PrivateEmailMessage) =>
      transport.sendMail({
        ...message,
        from: privateEmailSender
      })
  };
};

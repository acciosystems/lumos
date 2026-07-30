import { env } from '@lumos/env/email';
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: env.EMAIL_PORT === 465,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  body: string;
  type?: 'text' | 'html';
}

export async function sendEmail(options: SendEmailOptions) {
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    [options.type ?? 'text']: options.body,
  });
}

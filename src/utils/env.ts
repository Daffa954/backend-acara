import dotenv from "dotenv";

dotenv.config();

console.log(process.env.DATABASE_URL);

export const DATABASE_URL: string = process.env.DATABASE_URL || "";
export const SECRET: string = process.env.SECRET || "";

//EMAIL
export const EMAIL_SMTP_SECURE: boolean =
  Boolean(process.env.EMAIL_SMTP_SECURE) || false;
export const EMAIL_SMTP_PASS: string = process.env.EMAIL_SMTP_PASS || "";
export const EMAIL_SMTP_USER: string = process.env.EMAIL_SMTP_USER || "";
export const EMAIL_SMTP_PORT: number = Number(process.env.SMTP_PORT) || 465;

export const EMAIL_SMTP_HOST: string = process.env.SMTP_HOST || "";
export const EMAIL_SMTP_SERVICE_NAME: string =
  process.env.EMAIL_SMTP_SERVICE_NAME || "";
export const GMAIL_PASS: string = process.env.GMAIL_PASS || "";
export const GMAIL_USER: string = process.env.GMAIL_USER || "";

export const CLIENT_HOST: string = process.env.CLIENT_HOST || "";


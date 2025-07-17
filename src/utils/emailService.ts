import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function enviarEmail(destinatario: string, assunto: string, html: string) {
  await transporter.sendMail({
    from: `"Cardápio Digital" <${process.env.SMTP_USER}>`,
    to: destinatario,
    subject: assunto,
    html,
  });
}
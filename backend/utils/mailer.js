import nodemailer from 'nodemailer'

const transportConfig = process.env.MAIL_HOST
  ? {
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT || 587),
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    }
  : null

const transporter = transportConfig ? nodemailer.createTransport(transportConfig) : null

export async function sendEmail({ to, subject, text, html }) {
  if (!transporter) {
    console.log('Email disabled. Would send to:', to, { subject, text, html })
    return
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to,
    subject,
    text,
    html,
  })
}

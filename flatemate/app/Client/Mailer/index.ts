import nodemailer from "nodemailer"
export const transporter = nodemailer.createTransport({
    service: 'gmail', // Can use other providers like 'yahoo', 'outlook', or a custom SMTP server
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL_ID, // Your email address
      pass: process.env.NEXT_PUBLIC_EMAIL_PASS, // Your email password or app-specific password
    },
  });
'use server'

import { EmailTemplate } from "@/components/ui/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
    client_name: string;
    date: string;
    time: string;
    subject: string;
    duration: string;
}

export const sendEmail = async (data: EmailData, email: string) => {
  try {
    const response = await resend.emails.send({
      from: "CRM  <crm@resend.dev>",
    //   to: [email],
      to: ['ismailachibat4@gmail.com'],
      subject: data.subject,
      react: EmailTemplate({ client_name: data.client_name, date: data.date, time: data.time, subject: data.subject, duration: data.duration })
    });
    console.log("Email sent successfully:", response.error);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

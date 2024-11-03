import sgMail from "@sendgrid/mail";

import { NotificationData } from "@/data/notification";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function sendNotificationEmail({
  subject,
  text,
}: NotificationData): Promise<{ success: boolean; message: string }> {
  const notificationEmail = process.env.SENDGRID_EMAIL as string;

  const msg = {
    to: notificationEmail,
    from: notificationEmail,
    subject,
    text,
  };

  try {
    await sgMail.send(msg);

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email: ", error);
    return { success: false, message: "Error sending email" };
  }
}

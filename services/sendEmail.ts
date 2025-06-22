import { google } from "googleapis";
import fs from "fs";
import path from "path";

export const sendEmailViaGmail = async (
  to: string,
  subject: string,
  body: string,
  tokens: any,
  resumePath: string,
  resumeFilename: string
) => {
  console.log("📧 Email service called with:");
  console.log("  To:", to);
  console.log("  Subject:", subject);
  console.log("  Body length:", body ? body.length : "undefined");
  console.log("  Body preview:", body ? body.substring(0, 100) + "..." : "undefined");
  
  if (!body) {
    throw new Error("Email body is undefined or empty");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );

  oauth2Client.setCredentials(tokens);

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  // Read resume file and encode it in base64
  const resumeContent = fs.readFileSync(resumePath).toString("base64");

  const boundary = "__BOUNDARY__";

  const messageParts = [
    `--${boundary}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    body,
    ``,
    `--${boundary}`,
    `Content-Type: application/pdf`,
    `Content-Disposition: attachment; filename="${resumeFilename}"`,
    `Content-Transfer-Encoding: base64`,
    ``,
    resumeContent,
    `--${boundary}--`,
  ];

  const rawMessage = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    ``,
    ...messageParts,
  ].join("\r\n");

  const encodedMessage = Buffer.from(rawMessage)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });

  console.log(`✅ Email sent to ${to} with resume attached.`);
};

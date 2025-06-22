import axios from "axios";
import { createTransport } from "nodemailer";
import fs from "fs";

const HF_API_TOKEN = process.env.HF_TOKEN!;
const GMAIL_OAUTH_TOKEN = "YOUR_GMAIL_OAUTH_ACCESS_TOKEN";

export const generateAndSendEmail = async ({ user, row }: any) => {
  try {
    const prompt = `
You are writing a personalized cold email for a job application.

Candidate: ${user.fullName}
Email: ${user.email}
Resume Summary: ${user.resumeText}

Target:
Name: ${row.Name}
Company: ${row.Company}
Role: ${row["Job Title"]}

Write a cold email with strong personalization, value, and a call to action.
`;

    const response = await axios.post("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-alpha", {
      inputs: prompt,
    }, {
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
      },
    });

    const generatedText = response.data[0]?.generated_text || "Hi, this is a placeholder cover letter.";

    // Setup email
    const mail = {
      from: "me@gmail.com",
      to: row.Email,
      subject: "Opportunity to collaborate",
      text: generatedText,
      attachments: [
        {
          filename: "resume.pdf",
          content: fs.createReadStream("uploads/resume.pdf"), // Use actual path
        },
      ],
    };

    // TODO: Implement actual email sending logic here
    console.log("Generated email for:", row.Email, generatedText);
    
    return {
      success: true,
      email: row.Email,
      generatedText
    };
  } catch (error) {
    console.error("Error generating/sending email:", error);
    return {
      success: false,
      email: row.Email,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

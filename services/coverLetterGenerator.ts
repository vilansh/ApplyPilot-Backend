import fetch from "node-fetch";
import { generatePrompt } from "../shared/prompts/coverLetterTemplate";

export async function generateCoverLetter(recipient: any, resumeText: string) {
  const prompt = generatePrompt(recipient, resumeText);

  const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-large", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
    }),
  });

  const data = await response.json();

  if (data?.error) {
    console.error("❌ HuggingFace Error:", data.error);
    throw new Error(data.error);
  }

  const output = data[0]?.generated_text || "Failed to generate cover letter.";
  return output;
}

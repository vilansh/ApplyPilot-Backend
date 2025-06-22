import { HuggingFaceInference } from "@langchain/community/llms/hf"
import { PromptTemplate } from "@langchain/core/prompts"
import dotenv from "dotenv"
dotenv.config()

let model: HuggingFaceInference | null = null;

const getModel = () => {
  if (!model) {
    model = new HuggingFaceInference({
      model: "HuggingFaceH4/zephyr-7b-beta", // ✅ Best free model for instruction-style tasks
      apiKey: process.env.HF_TOKEN!,
      temperature: 0.6,
      maxTokens: 1024,
    })
  }
  return model;
}

const promptTemplate = new PromptTemplate({
  template: `
You are a job-seeking assistant helping candidates craft high-converting outreach emails and cover letters.

Use the following data to generate a concise, tailored message (under 200 words) with a **clear CTA**, strong **value proposition**, and based on **real results or credibility** from their resume.

---

### Candidate Details
Full Name: {name}
Email: {email}
Resume Text:
{resumeText}

---

### Target Recruiter
Recruiter Name: {recruiterName}
Job Title: {jobTitle}
Company: {company}

---

### Guidelines for Generation:
- Start with a **strong, value-driven hook**
- Highlight a **specific achievement** from the resume that aligns with the company/role
- Personalize it to the **company** or **role**
- End with a **clear CTA** (e.g., "Happy to send my resume" / "Would it make sense to chat?")
- Keep tone: friendly, confident, outcome-focused, human tone, natural tone

---

Return a personalized cold outreach email or cover letter that could be used in a Gmail message. Sign off with the candidate's full name.
`,
  inputVariables: ["name", "email", "resumeText", "recruiterName", "jobTitle", "company"],
})

export const generateLetter = async (row: any) => {
  const prompt = await promptTemplate.format({
    name: row.name,
    email: row.email,
    resumeText: row.resumeText || "No resume text provided",
    recruiterName: row.recruiterName || "Hiring Manager",
    jobTitle: row.jobTitle,
    company: row.company,
  })

  const modelInstance = getModel();
  const response = await modelInstance.invoke(prompt)
  return response
}

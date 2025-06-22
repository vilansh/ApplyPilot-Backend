// services/langchainService.ts
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { PromptTemplate } from "@langchain/core/prompts"

const template = `
You're writing a job application cover letter.

- Candidate: {{name}}
- Role: {{jobTitle}}
- Company: {{company}}
- Resume: {{resume}}

Write a 3-paragraph cover letter that is specific, personalized, and compelling.
`;

const prompt = PromptTemplate.fromTemplate(template);

let llm: HuggingFaceInference | null = null;

const getLLM = () => {
  if (!llm) {
    llm = new HuggingFaceInference({ 
      model: "HuggingFaceH4/zephyr-7b-beta",
      apiKey: process.env.HF_TOKEN,
      temperature: 0.7 
    });
  }
  return llm;
};

export async function generateCoverLetter(variables: {
  name: string;
  jobTitle: string;
  company: string;
  resume: string;
}) {
  const modelInstance = getLLM();
  const formattedPrompt = await prompt.format(variables);
  const response = await modelInstance.invoke(formattedPrompt);
  return response;
}

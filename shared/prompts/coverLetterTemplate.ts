export const generatePrompt = (recipient: any, resumeText: string) => {
    return `
  You are an expert job application assistant.
  
  Generate a short, personalized, proof-based cover letter using:
  
  - Name: ${recipient.name}
  - Role: ${recipient.jobTitle}
  - Company: ${recipient.company}
  
  Use this resume for context:
  """
  ${resumeText}
  """
  
  Constraints:
  - Max 250 words
  - Specific examples over fluff
  - End with a clear call to action
  `;
  };
  
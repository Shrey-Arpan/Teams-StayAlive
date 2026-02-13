
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateStatusMessage = async (): Promise<string | undefined> => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent("Generate a short, professional, and convincing Microsoft Teams status message (under 10 words) that explains why I'm 'Available' but busy, like 'Deep work on project specs' or 'Reviewing quarter documents'. Provide just the text.");
    const response = await result.response;
    return response.text().replace(/"/g, '').trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Focusing on documentation.";
  }
};

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Scholarship } from "../types";

// In a real app, this should be an env variable or user input
// For this demo, we'll ask the user to input it in the UI
let API_KEY = '';

export const setGeminiApiKey = (key: string) => {
    API_KEY = key;
};

export const generateTailoredEssay = async (
    baseEssay: string,
    scholarship: Scholarship,
    profile?: {
        full_name?: string | null;
        age?: number | null;
        graduation_year?: number | null;
        is_transfer?: boolean;
        interests?: string[] | null;
        quiz_answers?: Record<string, string> | null;
    }
): Promise<string> => {
    if (!API_KEY) {
        throw new Error("Gemini API Key is missing. Please enter it in the settings.");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);

    // Model fallback order: 
    // 1. gemini-flash-latest
    // 2. gemini-flash-lite-latest
    // 3. gemini-3-pro-preview
    const models = [
        "gemini-flash-latest",
        "gemini-flash-lite-latest",
        "gemini-3-pro-preview"
    ];

    let studentProfileContext = "";
    if (profile) {
        let quizContext = "";
        if (profile.quiz_answers) {
            quizContext = "\n    Tailoring Quiz Answers:\n" +
                Object.entries(profile.quiz_answers)
                    .map(([q, a]) => `    - ${q}: ${a}`)
                    .join("\n");
        }

        studentProfileContext = `
    Student Profile Details:
    - Name: ${profile.full_name || "Not provided"}
    - Age: ${profile.age || "Not provided"}
    - Graduation Year: ${profile.graduation_year || "Not provided"}
    - Transfer Student: ${profile.is_transfer ? "Yes" : "No"}
    - Interests: ${profile.interests?.join(", ") || "Not provided"}${quizContext}
        `;
    }

    const prompt = `
    You are an expert scholarship essay writer and college counselor.
    
    Task: Write a COMPLETELY NEW scholarship essay from scratch that answers the specific essay question below.
    
    SCHOLARSHIP INFORMATION:
    - Name: ${scholarship.name}
    - Provider: ${scholarship.provider}
    - Description: ${scholarship.description}
    - Requirements: ${scholarship.requirements.join(', ')}
    
    ESSAY QUESTION TO ANSWER:
    "${baseEssay}"
    
    STUDENT BACKGROUND (Use this to understand the student, but DO NOT copy or rewrite it):
    ${studentProfileContext}
    
    Student's Personal Story/Background:
    "${baseEssay}"
    
    CRITICAL INSTRUCTIONS:
    1. Write a BRAND NEW essay that directly answers the essay question above
    2. DO NOT rewrite or paraphrase the student's background essay
    3. Use the student's background information ONLY to understand their experiences, voice, and perspective
    4. Create original content that specifically addresses the scholarship's requirements and essay question
    5. Draw from the student's experiences mentioned in their background, but present them in a fresh way that fits the question
    6. Keep the student's authentic voice but craft entirely new sentences and structure
    7. Make the essay compelling, specific, and directly relevant to this scholarship
    8. Do NOT use em dashes (—) in the essay. Use commas, semicolons, or parentheses instead
    9. Length: 400-650 words
    10. Return ONLY the essay text, no introduction or explanation
  `;

    // Try each model in order
    for (let i = 0; i < models.length; i++) {
        try {
            console.log(`Attempting with model: ${models[i]}`);
            const model = genAI.getGenerativeModel({ model: models[i] });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error(`Error with model ${models[i]}:`, error);

            // If this is the last model, throw the error
            if (i === models.length - 1) {
                throw new Error("Failed to generate essay with all available models. Please check your API key and try again.");
            }

            // Otherwise, continue to next model
            console.log(`Falling back to next model...`);
        }
    }

    // This should never be reached, but TypeScript requires it
    throw new Error("Failed to generate essay. Please check your API key and try again.");
};

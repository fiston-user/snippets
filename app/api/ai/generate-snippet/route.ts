import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { AIResponseParser } from "@/lib/utils/ai-parser";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(`
      You are a code snippet generator. Generate a code snippet based on this request: "${prompt}"
      
      Important: Your response must be ONLY a valid JSON object with no additional text or formatting. Use this exact format:
      {
        "title": "A clear, concise title",
        "description": "A detailed description of what the code does and how to use it",
        "code": "// Your code here",
        "language": "One of: JavaScript, TypeScript, Python, Java, C++, Ruby, Go, Rust, PHP, Swift",
        "framework": "One of: React, Vue, Angular, Next.js, Nuxt, Svelte, Express, Django, Spring, Laravel (or empty if none)",
        "category": "One of: Utility Functions, Components, Hooks, Algorithms, Data Structures, API, Database, Authentication, Testing, DevOps",
        "tags": ["relevant", "tags", "max 5"]
      }

      Rules:
      1. Response must be ONLY the JSON object, no markdown formatting or additional text
      2. Include error handling where appropriate
      3. Language must match one from the list above exactly (case-sensitive)
      4. Framework should only be included if actually used
      5. Maximum 5 relevant tags
      6. Code should include comments and proper formatting
    `);

    const response = result.response;
    const text = response.text();

    console.log("Raw AI response:", text);

    const parseResult = AIResponseParser.parse(text);

    if (!parseResult.success) {
      console.error("Parsing error:", parseResult.error);
      return NextResponse.json(
        {
          error: `Failed to generate snippet: ${parseResult.error.message}`,
          details: parseResult.error.details,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(parseResult.data);
  } catch (error) {
    console.error("Error generating snippet:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return NextResponse.json(
      { error: "Failed to generate snippet. Please try again." },
      { status: 500 }
    );
  }
}

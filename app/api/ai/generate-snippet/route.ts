import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(`
      You are a code snippet generator. Generate a code snippet based on this request: "${prompt}"
      
      Important: Your response must be a valid JSON object and nothing else. Use this exact format, and make sure to properly escape the code:
      {
        "title": "A clear, concise title",
        "description": "A detailed description of what the code does and how to use it",
        "code": "// Your code here\\n// Use double backslashes for newlines\\n// Example:\\nfunction example() {\\n  console.log('hello');\\n}",
        "language": "One of: JavaScript, TypeScript, Python, Java, C++, Ruby, Go, Rust, PHP, Swift",
        "framework": "One of: React, Vue, Angular, Next.js, Nuxt, Svelte, Express, Django, Spring, Laravel (or empty if none)",
        "category": "One of: Utility Functions, Components, Hooks, Algorithms, Data Structures, API, Database, Authentication, Testing, DevOps",
        "tags": ["relevant", "tags", "max 5"]
      }

      Rules:
      1. Response must be ONLY the JSON object, no other text
      2. Code must be properly escaped:
         - Use \\n for newlines
         - Use \\" for quotes
         - Use \\\\ for backslashes
      3. Include error handling where appropriate
      4. Language must match one from the list above
      5. Framework should only be included if actually used
      6. Maximum 5 relevant tags
      7. Code should include comments and proper formatting
    `);

    const response = result.response;
    const text = response.text();

    try {
      // Try to parse the entire response as JSON first
      const snippet = JSON.parse(text);

      // Clean up the code field by replacing escaped newlines with actual newlines
      snippet.code = snippet.code
        .replace(/\\n/g, "\n")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");

      return NextResponse.json(snippet);
    } catch (e) {
      // If that fails, try to extract JSON using regex
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Failed to parse AI response");
      }
      const snippet = JSON.parse(jsonMatch[0]);

      // Clean up the code field by replacing escaped newlines with actual newlines
      snippet.code = snippet.code
        .replace(/\\n/g, "\n")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");

      return NextResponse.json(snippet);
    }
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

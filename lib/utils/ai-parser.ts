import { z } from "zod";

// Define the schema for snippet validation
const snippetSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description too long"),
  code: z.string().min(1, "Code is required").max(10000, "Code too long"),
  language: z.enum(
    [
      "JavaScript",
      "TypeScript",
      "Python",
      "Java",
      "C++",
      "Ruby",
      "Go",
      "Rust",
      "PHP",
      "Swift",
    ],
    {
      errorMap: () => ({ message: "Invalid language selected" }),
    }
  ),
  framework: z
    .union([
      z.enum([
        "React",
        "Vue",
        "Angular",
        "Next.js",
        "Nuxt",
        "Svelte",
        "Express",
        "Django",
        "Spring",
        "Laravel",
      ]),
      z.literal(""),
      z.literal("None"),
      z.null(),
    ])
    .transform((val) => (val === null ? "" : val))
    .optional(),
  category: z.enum(
    [
      "Utility Functions",
      "Components",
      "Hooks",
      "Algorithms",
      "Data Structures",
      "API",
      "Database",
      "Authentication",
      "Testing",
      "DevOps",
    ],
    {
      errorMap: () => ({ message: "Invalid category selected" }),
    }
  ),
  tags: z.array(z.string()).min(1).max(5),
});

export type AISnippet = z.infer<typeof snippetSchema>;

interface ParsingError {
  type: "EXTRACTION" | "PARSING" | "VALIDATION";
  message: string;
  details?: any;
}

export class AIResponseParser {
  private static cleanResponse(text: string): string {
    try {
      // First try to parse the text directly as JSON
      JSON.parse(text);
      return text;
    } catch {
      // If direct parsing fails, clean up the text
      let cleaned = text;

      // Remove markdown code blocks
      cleaned = cleaned.replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, "$1");

      // Remove any leading/trailing whitespace
      cleaned = cleaned.trim();

      // Fix escaped quotes and template literals
      cleaned = cleaned
        .replace(/\\"/g, '"')
        .replace(/`([^`]*)`/g, (_, content) => {
          // Properly escape template literals
          return JSON.stringify(content.replace(/\${/g, "\\${"));
        });

      return cleaned;
    }
  }

  private static extractJSON(text: string): string | null {
    try {
      // First try to parse the entire text as JSON
      const parsed = JSON.parse(text);
      return JSON.stringify(parsed); // Normalize the JSON
    } catch {
      // If that fails, try to find a valid JSON object
      const matches = text.match(/\{[\s\S]*\}/g) || [];

      for (const match of matches) {
        try {
          const parsed = JSON.parse(match);
          return JSON.stringify(parsed); // Return normalized JSON
        } catch {
          continue;
        }
      }
    }
    return null;
  }

  private static validateAndTransform(data: any): AISnippet {
    // Clean up any potential duplicate fields
    if (typeof data === "object" && data !== null) {
      // For each field in the schema, only keep the first occurrence
      const cleanedData: any = {};
      for (const field of Object.keys(snippetSchema.shape)) {
        if (field in data) {
          cleanedData[field] = data[field];
        }
      }
      data = cleanedData;
    }

    // Pre-process the data before validation
    if (data.framework === null || data.framework === undefined) {
      data.framework = "";
    }

    const result = snippetSchema.safeParse(data);
    if (!result.success) {
      console.error("Validation error details:", result.error.format());
      throw {
        type: "VALIDATION",
        message: "Validation failed",
        details: result.error.format(),
      };
    }
    return result.data;
  }

  static parse(
    aiResponse: string
  ):
    | { success: true; data: AISnippet }
    | { success: false; error: ParsingError } {
    try {
      // Log the raw response for debugging
      console.log("Raw response:", aiResponse);

      // Step 1: Clean the response
      const cleanedResponse = this.cleanResponse(aiResponse);
      console.log("Cleaned response:", cleanedResponse);

      // Step 2: Extract JSON
      const jsonText = this.extractJSON(cleanedResponse);
      if (!jsonText) {
        console.error("Failed to extract JSON from:", cleanedResponse);
        return {
          success: false,
          error: {
            type: "EXTRACTION",
            message: "No valid JSON object found in response",
          },
        };
      }
      console.log("Extracted JSON:", jsonText);

      // Step 3: Parse JSON
      let parsedData;
      try {
        parsedData = JSON.parse(jsonText);
      } catch (e) {
        console.error("JSON parse error:", e);
        return {
          success: false,
          error: {
            type: "PARSING",
            message: "Failed to parse JSON",
            details: e instanceof Error ? e.message : "Unknown parsing error",
          },
        };
      }
      console.log("Parsed data:", parsedData);

      // Step 4: Validate and transform
      const validatedData = this.validateAndTransform(parsedData);
      console.log("Validated data:", validatedData);

      return {
        success: true,
        data: validatedData,
      };
    } catch (error) {
      console.error("Parser error:", error);
      if ((error as ParsingError).type) {
        return {
          success: false,
          error: error as ParsingError,
        };
      }
      return {
        success: false,
        error: {
          type: "PARSING",
          message: "Unexpected error during parsing",
          details: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }
}

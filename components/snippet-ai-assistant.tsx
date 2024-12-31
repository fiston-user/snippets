"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bot, Sparkles, Loader2, Lightbulb } from "lucide-react";
import { toast } from "sonner";

const EXAMPLE_PROMPTS = [
  {
    title: "React Hook",
    prompt: "Create a React hook for handling infinite scroll with TypeScript",
    icon: "🪝",
  },
  {
    title: "API Utility",
    prompt:
      "Generate a TypeScript utility function for handling API errors with proper types",
    icon: "🔄",
  },
  {
    title: "Authentication",
    prompt:
      "Create a Next.js API route middleware for handling JWT authentication",
    icon: "🔒",
  },
  {
    title: "Data Structure",
    prompt:
      "Create a TypeScript implementation of a priority queue with generics",
    icon: "📚",
  },
  {
    title: "Form Validation",
    prompt:
      "Generate a Zod schema for validating a complex user registration form",
    icon: "✅",
  },
  {
    title: "State Management",
    prompt:
      "Create a custom React context provider for managing theme and user preferences",
    icon: "💾",
  },
];

interface SnippetAIAssistantProps {
  onSnippetGenerated: (snippet: {
    title: string;
    description: string;
    code: string;
    language: string;
    framework?: string;
    category: string;
    tags: string[];
  }) => void;
}

export function SnippetAIAssistant({
  onSnippetGenerated,
}: SnippetAIAssistantProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSnippet = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description of what you want to create");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate-snippet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate snippet");
      }

      const data = await response.json();
      onSnippetGenerated(data);
      toast.success("Snippet generated successfully!");
    } catch (error) {
      console.error("Error generating snippet:", error);
      toast.error("Failed to generate snippet. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Describe the snippet you want to create. For example: 'Create a React hook for handling infinite scroll' or 'Generate a utility function for deep cloning objects in TypeScript'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[300px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Be specific about the language, framework, and functionality you
              want.
            </p>
          </div>
          <Button
            className="w-full"
            onClick={generateSnippet}
            disabled={isGenerating || !prompt.trim()}
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Snippet
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-5 w-5" />
            Example Prompts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {EXAMPLE_PROMPTS.map((example) => (
              <Button
                key={example.title}
                variant="outline"
                className="h-auto justify-start gap-2 px-3 py-2"
                onClick={() => setPrompt(example.prompt)}
                disabled={isGenerating}
              >
                <span className="text-lg">{example.icon}</span>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm font-medium">{example.title}</span>
                  <span className="line-clamp-2 text-xs text-muted-foreground">
                    {example.prompt}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

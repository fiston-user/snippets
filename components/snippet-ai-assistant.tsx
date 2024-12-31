"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bot, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
            className="min-h-[100px]"
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
  );
}

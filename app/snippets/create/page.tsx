"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const createSnippetSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be less than 2000 characters"),
  code: z
    .string()
    .min(1, "Code is required")
    .max(10000, "Code must be less than 10000 characters"),
  language: z.string().min(1, "Language is required"),
  framework: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  tags: z
    .array(z.string())
    .min(1, "At least one tag is required")
    .max(5, "Maximum 5 tags allowed"),
  isPublic: z.boolean().default(true),
});

type FormData = z.infer<typeof createSnippetSchema>;

const LANGUAGES = [
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
];

const FRAMEWORKS = [
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
];

const CATEGORIES = [
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
];

export default function CreateSnippetPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [tagInput, setTagInput] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(createSnippetSchema),
    defaultValues: {
      title: "",
      description: "",
      code: "",
      language: "",
      framework: "",
      category: "",
      tags: [],
      isPublic: true,
    },
  });

  const { isSubmitting } = form.formState;
  const code = form.watch("code");
  const language = form.watch("language");

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/snippets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 422) {
          // Handle validation errors
          error.forEach((err: { path: string[]; message: string }) => {
            form.setError(err.path[0] as keyof FormData, {
              message: err.message,
            });
          });
          return;
        }
        throw new Error("Failed to create snippet");
      }

      const snippet = await response.json();
      toast.success("Snippet created successfully");
      router.push(`/snippets/${snippet.id}`);
    } catch (error) {
      toast.error("Failed to create snippet");
    }
  };

  const addTag = (tag: string) => {
    const currentTags = form.getValues("tags");
    if (tag && !currentTags.includes(tag) && currentTags.length < 5) {
      form.setValue("tags", [...currentTags, tag]);
      setTagInput("");
    } else if (currentTags.length >= 5) {
      toast.error("Maximum 5 tags allowed");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  return (
    <div className="container max-w-4xl py-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Snippet</CardTitle>
          <CardDescription>
            Share your code snippet with the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a descriptive title"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A clear title that describes what your code does
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what your code snippet does"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Explain how to use the code and what problem it solves
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <Tabs defaultValue="write" className="w-full">
                      <TabsList className="mb-2">
                        <TabsTrigger value="write">Write</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                      </TabsList>
                      <TabsContent value="write">
                        <FormControl>
                          <Textarea
                            placeholder="Paste your code here"
                            className="min-h-[300px] font-mono"
                            {...field}
                          />
                        </FormControl>
                      </TabsContent>
                      <TabsContent value="preview">
                        <div className="relative rounded-lg border">
                          <div className="overflow-x-auto p-4">
                            <SyntaxHighlighter
                              language={language?.toLowerCase() || "plaintext"}
                              style={theme === "dark" ? oneDark : oneLight}
                              customStyle={{
                                margin: 0,
                                background: "transparent",
                                minHeight: "300px",
                              }}
                            >
                              {code || "// Your code preview will appear here"}
                            </SyntaxHighlighter>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                    <FormDescription>
                      The actual code snippet you want to share
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The programming language used
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="framework"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Framework (Optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a framework" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {FRAMEWORKS.map((fw) => (
                            <SelectItem key={fw} value={fw}>
                              {fw}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The framework or library used (if any)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the most relevant category for your snippet
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                              <button
                                type="button"
                                className="ml-1"
                                onClick={() => removeTag(tag)}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                          <Input
                            placeholder="Add a tag (press Enter)"
                            className="!mt-0 w-[200px]"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagInputKeyDown}
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Add up to 5 tags to help others find your snippet
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Snippet
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SnippetCard } from "@/components/snippet-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import type { Snippet } from "@/types";
import { toast } from "sonner";

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

export default function SnippetsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState(
    searchParams.get("language") || "all"
  );
  const [framework, setFramework] = useState(
    searchParams.get("framework") || "all"
  );
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const fetchSnippets = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (language && language !== "all") params.append("language", language);
      if (framework && framework !== "all")
        params.append("framework", framework);
      if (category && category !== "all") params.append("category", category);
      if (search) params.append("search", search);

      const response = await fetch(`/api/snippets?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch snippets");
      }

      const data = await response.json();
      setSnippets(data);
    } catch (error) {
      toast.error("Failed to fetch snippets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, [language, framework, category, search]);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/snippets?${params.toString()}`);
  };

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Code Snippets</h1>
          <Button>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-[200px_1fr]">
          {/* Filters */}
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select
                value={language}
                onValueChange={(value) => {
                  setLanguage(value);
                  updateFilters("language", value === "all" ? "" : value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Framework</label>
              <Select
                value={framework}
                onValueChange={(value) => {
                  setFramework(value);
                  updateFilters("framework", value === "all" ? "" : value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Frameworks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frameworks</SelectItem>
                  {FRAMEWORKS.map((fw) => (
                    <SelectItem key={fw} value={fw}>
                      {fw}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={category}
                onValueChange={(value) => {
                  setCategory(value);
                  updateFilters("category", value === "all" ? "" : value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Snippets Grid */}
          <div className="space-y-6">
            <Input
              placeholder="Search snippets..."
              className="max-w-md"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                updateFilters("search", e.target.value);
              }}
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[200px] rounded-lg border bg-muted/10 animate-pulse"
                  />
                ))
              ) : snippets.length > 0 ? (
                snippets.map((snippet) => (
                  <SnippetCard key={snippet.id} snippet={snippet} />
                ))
              ) : (
                <div className="col-span-full text-center">
                  <p className="text-muted-foreground">No snippets found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

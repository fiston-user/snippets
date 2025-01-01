"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import type { Snippet } from "@/types";
import { toast } from "sonner";
import { FiltersSidebar } from "@/components/snippets/filters-sidebar";
import { SnippetsGrid } from "@/components/snippets/snippets-grid";

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
  const [isOpen, setIsOpen] = useState(false);

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
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <FiltersSidebar
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            search={search}
            language={language}
            framework={framework}
            category={category}
            onSearchChange={(value) => {
              setSearch(value);
              updateFilters("search", value);
            }}
            onLanguageChange={(value) => {
              setLanguage(value);
              updateFilters("language", value === "all" ? "" : value);
            }}
            onFrameworkChange={(value) => {
              setFramework(value);
              updateFilters("framework", value === "all" ? "" : value);
            }}
            onCategoryChange={(value) => {
              setCategory(value);
              updateFilters("category", value === "all" ? "" : value);
            }}
            onReset={() => {
              setLanguage("all");
              setFramework("all");
              setCategory("all");
              setSearch("");
              router.push("/snippets");
            }}
          />

          <SnippetsGrid snippets={snippets} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

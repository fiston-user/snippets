import { SnippetCard } from "@/components/snippet-card";
import type { Snippet } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface SnippetsGridProps {
  snippets: Snippet[];
  isLoading: boolean;
}

export function SnippetsGrid({ snippets, isLoading }: SnippetsGridProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="col-span-full flex flex-col items-center justify-center gap-4 rounded-lg border bg-muted/10 p-8 text-center">
            <div className="space-y-2">
              <p className="text-lg font-medium">No snippets found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or create a new snippet
              </p>
            </div>
            <Button onClick={() => router.push("/snippets/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Snippet
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

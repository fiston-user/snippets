"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SnippetsGrid } from "@/components/snippets/snippets-grid";
import type { Snippet } from "@/types";
import { toast } from "sonner";

export default function MySnippetsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await fetch("/api/snippets/my");
        if (!response.ok) {
          throw new Error("Failed to fetch snippets");
        }
        const data = await response.json();
        setSnippets(data);
      } catch (error) {
        toast.error("Failed to fetch your snippets");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchSnippets();
    }
  }, [session?.user]);

  if (status === "loading" || !session) {
    return null;
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Snippets</h1>
          <Button onClick={() => router.push("/snippets/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Create Snippet
          </Button>
        </div>

        <SnippetsGrid snippets={snippets} isLoading={isLoading} />
      </div>
    </div>
  );
}

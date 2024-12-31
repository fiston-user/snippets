"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Code2, Sparkles, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function SnippetCard({ snippet }: { snippet: any }) {
  const router = useRouter();

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
      onClick={() => router.push(`/snippets/${snippet.id}`)}
    >
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="line-clamp-1 text-lg">
              {snippet.title}
            </CardTitle>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={snippet.author?.image} />
                  <AvatarFallback>
                    {snippet.author?.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="line-clamp-1">{snippet.author?.name}</span>
              </div>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(snippet.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {snippet.description}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{snippet.language}</Badge>
          {snippet.framework && (
            <Badge variant="outline">{snippet.framework}</Badge>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [featuredSnippets, setFeaturedSnippets] = useState<any[]>([]);
  const [recentSnippets, setRecentSnippets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const [featuredResponse, recentResponse] = await Promise.all([
          fetch("/api/snippets?sort=likes&limit=3"),
          fetch("/api/snippets?sort=date&limit=6"),
        ]);

        if (featuredResponse.ok) {
          const featuredData = await featuredResponse.json();
          setFeaturedSnippets(featuredData);
        }

        if (recentResponse.ok) {
          const recentData = await recentResponse.json();
          setRecentSnippets(recentData);
        }
      } catch (error) {
        console.error("Failed to fetch snippets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="border-b bg-muted/40">
        <div className="container space-y-6 py-12 text-center lg:py-24">
          <div className="mx-auto max-w-[800px] space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Share and discover code snippets with the community
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground">
              A place to find and share code snippets, utilities, and solutions
              to common programming problems.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => router.push("/snippets/create")}>
              Share a snippet
              <Code2 className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/snippets")}
            >
              Browse snippets
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <div className="container space-y-12 py-12">
        {/* Featured Snippets */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                <Sparkles className="h-6 w-6 text-primary" />
                Featured Snippets
              </h2>
              <p className="text-muted-foreground">
                Popular code snippets from the community
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => router.push("/snippets?sort=likes")}
            >
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array(3)
                  .fill(null)
                  .map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader className="space-y-4">
                        <div className="h-6 w-2/3 rounded-md bg-muted" />
                        <div className="space-y-2">
                          <div className="h-4 w-full rounded-md bg-muted" />
                          <div className="h-4 w-4/5 rounded-md bg-muted" />
                        </div>
                        <div className="flex gap-2">
                          <div className="h-6 w-16 rounded-full bg-muted" />
                          <div className="h-6 w-16 rounded-full bg-muted" />
                        </div>
                      </CardHeader>
                    </Card>
                  ))
              : featuredSnippets.map((snippet) => (
                  <SnippetCard key={snippet.id} snippet={snippet} />
                ))}
          </div>
        </section>

        {/* Recent Snippets */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                <Zap className="h-6 w-6 text-primary" />
                Recent Snippets
              </h2>
              <p className="text-muted-foreground">
                Latest additions to our collection
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => router.push("/snippets?sort=date")}
            >
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array(6)
                  .fill(null)
                  .map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader className="space-y-4">
                        <div className="h-6 w-2/3 rounded-md bg-muted" />
                        <div className="space-y-2">
                          <div className="h-4 w-full rounded-md bg-muted" />
                          <div className="h-4 w-4/5 rounded-md bg-muted" />
                        </div>
                        <div className="flex gap-2">
                          <div className="h-6 w-16 rounded-full bg-muted" />
                          <div className="h-6 w-16 rounded-full bg-muted" />
                        </div>
                      </CardHeader>
                    </Card>
                  ))
              : recentSnippets.map((snippet) => (
                  <SnippetCard key={snippet.id} snippet={snippet} />
                ))}
          </div>
        </section>
      </div>
    </div>
  );
}

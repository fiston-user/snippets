"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Share2, Link, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

function SnippetCard({ snippet }: { snippet: any }) {
  return (
    <Card className="group cursor-pointer transition-colors hover:bg-muted/50">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="line-clamp-1 text-base">
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
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>
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

export default function SnippetPage() {
  const router = useRouter();
  const { id } = useParams();
  const { theme } = useTheme();
  const [snippet, setSnippet] = useState<any>(null);
  const [relatedSnippets, setRelatedSnippets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [snippetResponse, relatedResponse] = await Promise.all([
          fetch(`/api/snippets/${id}`),
          fetch(
            `/api/snippets?language=${encodeURIComponent(snippet?.language || "")}&limit=3`
          ),
        ]);

        if (!snippetResponse.ok) {
          throw new Error("Failed to fetch snippet");
        }

        const snippetData = await snippetResponse.json();
        setSnippet(snippetData);

        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedSnippets(
            relatedData.filter((s: any) => s.id !== id).slice(0, 3)
          );
        }
      } catch (error) {
        toast.error("Failed to fetch snippet");
        router.push("/snippets");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, router, snippet?.language]);

  const copyCode = () => {
    if (!snippet?.code) return;
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareSnippet = () => {
    setIsShareDialogOpen(true);
  };

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    toast.success("Link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-6">
        <div className="space-y-4">
          <div className="h-8 w-3/4 animate-pulse rounded-lg bg-muted"></div>
          <div className="h-24 animate-pulse rounded-lg bg-muted"></div>
          <div className="h-[300px] animate-pulse rounded-lg bg-muted"></div>
        </div>
      </div>
    );
  }

  if (!snippet) {
    return null;
  }

  return (
    <div className="container py-6">
      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="border-b p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">{snippet.title}</h2>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={snippet.author?.image} />
                        <AvatarFallback>
                          {snippet.author?.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{snippet.author?.name}</span>
                    </div>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(snippet.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={shareSnippet}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={copyCode}>
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy code
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                {snippet.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary">{snippet.language}</Badge>
                {snippet.framework && (
                  <Badge variant="secondary">{snippet.framework}</Badge>
                )}
                <Badge variant="secondary">{snippet.category}</Badge>
                {snippet.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto p-6">
              <SyntaxHighlighter
                language={snippet.language?.toLowerCase() || "plaintext"}
                style={theme === "dark" ? oneDark : oneLight}
                customStyle={{
                  margin: 0,
                  borderRadius: "0.5rem",
                }}
                showLineNumbers={true}
                wrapLines={true}
              >
                {snippet.code}
              </SyntaxHighlighter>
            </div>
          </Card>
        </div>

        {relatedSnippets.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">More like this</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() =>
                  router.push(`/snippets?language=${snippet.language}`)
                }
              >
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4">
              {relatedSnippets.map((relatedSnippet) => (
                <div
                  key={relatedSnippet.id}
                  onClick={() => router.push(`/snippets/${relatedSnippet.id}`)}
                >
                  <SnippetCard snippet={relatedSnippet} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share snippet</DialogTitle>
            <DialogDescription>
              Share this snippet with others by copying the link below
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input readOnly value={window.location.href} className="w-full" />
            </div>
            <Button
              type="button"
              variant="secondary"
              className="px-3"
              onClick={copyLink}
            >
              {linkCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy link</span>
            </Button>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => setIsShareDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

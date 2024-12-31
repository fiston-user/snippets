"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import type { Snippet } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquare, Share2, Bookmark, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

export default function SnippetPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await fetch(`/api/snippets/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch snippet");
        }
        const data = await response.json();
        setSnippet(data);
      } catch (error) {
        toast.error("Failed to fetch snippet");
        router.push("/snippets");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnippet();
  }, [id, router]);

  const copyToClipboard = () => {
    if (snippet) {
      navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-6">
        <div className="space-y-6">
          <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />
          <div className="h-24 animate-pulse rounded-md bg-muted" />
          <div className="h-64 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    );
  }

  if (!snippet) {
    return null;
  }

  return (
    <div className="container max-w-4xl py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {snippet.title}
            </h1>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={snippet.author.image || ""} />
                  <AvatarFallback>
                    {snippet.author.name?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{snippet.author.name}</span>
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
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground">{snippet.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge>{snippet.language}</Badge>
          {snippet.framework && (
            <Badge variant="outline">{snippet.framework}</Badge>
          )}
          {snippet.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Code */}
        <div className="relative rounded-lg border">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <span className="text-sm font-medium">Code</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 space-x-2"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
              <span>{copied ? "Copied!" : "Copy code"}</span>
            </Button>
          </div>
          <div className="overflow-x-auto p-4">
            <SyntaxHighlighter
              language={snippet.language.toLowerCase()}
              style={theme === "dark" ? oneDark : oneLight}
              customStyle={{
                margin: 0,
                background: "transparent",
              }}
            >
              {snippet.code}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* Interactions */}
        <div className="flex items-center space-x-4 border-t pt-4">
          <Button variant="ghost" size="sm" className="space-x-2">
            <Heart className="h-4 w-4" />
            <span>{snippet.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>{snippet.comments?.length || 0}</span>
          </Button>
        </div>

        {/* Comments */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight">Comments</h2>
          {session ? (
            <div className="space-y-4">
              <Textarea
                placeholder="Leave a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button disabled={!comment.trim() || isSubmitting}>
                {isSubmitting && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Comment
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Please sign in to leave a comment.
            </p>
          )}
          <div className="space-y-4">
            {snippet.comments?.map((comment) => (
              <div key={comment.id} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={comment.author.image || ""} />
                    <AvatarFallback>
                      {comment.author.name?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {comment.author.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

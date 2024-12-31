import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Heart, MessageSquare } from "lucide-react";
import type { Snippet } from "@/types";

interface SnippetCardProps {
  snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <Link
                href={`/snippets/${snippet.id}`}
                className="font-semibold hover:underline"
              >
                {snippet.title}
              </Link>
              <p className="text-sm text-muted-foreground">
                by {snippet.author.name}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {snippet.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary">{snippet.language}</Badge>
          {snippet.framework && (
            <Badge variant="outline">{snippet.framework}</Badge>
          )}
          {snippet.tags.slice(0, 2).map((tag: string) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <div className="flex w-full items-center justify-between">
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Heart className="mr-1 h-4 w-4" />
              {snippet.likes}
            </div>
            <div className="flex items-center">
              <MessageSquare className="mr-1 h-4 w-4" />
              {/* Add comments count here */}0
            </div>
          </div>
          <Link href={`/snippets/${snippet.id}`}>
            <Button variant="ghost" size="sm">
              View Snippet
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

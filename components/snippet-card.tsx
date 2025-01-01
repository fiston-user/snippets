import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bookmark, Clock } from "lucide-react";
import type { Snippet } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface SnippetCardProps {
  snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  const timeAgo = formatDistanceToNow(new Date(snippet.createdAt), {
    addSuffix: true,
  });

  return (
    <Card className="group flex flex-col transition-colors hover:border-primary/50">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <Link
              href={`/snippets/${snippet.id}`}
              className="text-lg font-semibold hover:underline"
            >
              {snippet.title}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {snippet.description}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="default"
            className="bg-primary/10 text-primary hover:bg-primary/20"
          >
            {snippet.language}
          </Badge>
          {snippet.framework && (
            <Badge variant="outline" className="hover:bg-muted">
              {snippet.framework}
            </Badge>
          )}
          {snippet.tags.slice(0, 2).map((tag: string) => (
            <Badge key={tag} variant="outline" className="hover:bg-muted">
              {tag}
            </Badge>
          ))}
          {snippet.tags.length > 2 && (
            <Badge variant="outline" className="hover:bg-muted">
              +{snippet.tags.length - 2} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="mt-auto pt-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/users/${snippet.author.id}`}>
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={snippet.author.image || ""}
                        alt={snippet.author.name}
                      />
                      <AvatarFallback>
                        {snippet.author.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{snippet.author.name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {timeAgo}
            </span>
          </div>
          <Link href={`/snippets/${snippet.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="group-hover:bg-primary/10"
            >
              View Snippet
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

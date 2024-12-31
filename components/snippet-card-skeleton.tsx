import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";

export function SnippetCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-2 h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-3/4" />
        <div className="mt-4 flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <div className="flex w-full items-center justify-between">
          <div className="flex space-x-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      </CardFooter>
    </Card>
  );
}

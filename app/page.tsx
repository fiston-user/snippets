import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Code2, Star, Bookmark } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-4 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
          Share, discover, and learn from code snippets
        </h1>
        <p className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
          A modern platform for developers to share and discover useful code
          snippets. Save time and learn from the community.
        </p>
        <div className="flex gap-4">
          <Link href="/snippets">
            <Button size="lg">
              Browse Snippets
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/snippets/create">
            <Button variant="outline" size="lg">
              Share a Snippet
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container grid gap-6 py-8 md:grid-cols-3">
        <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
          <Code2 className="h-12 w-12" />
          <h3 className="text-xl font-bold">Code Snippets</h3>
          <p className="text-center text-muted-foreground">
            Share and discover reusable code snippets from the community
          </p>
        </div>
        <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
          <Star className="h-12 w-12" />
          <h3 className="text-xl font-bold">Popular Categories</h3>
          <p className="text-center text-muted-foreground">
            Find snippets by programming language, framework, or category
          </p>
        </div>
        <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
          <Bookmark className="h-12 w-12" />
          <h3 className="text-xl font-bold">Save & Organize</h3>
          <p className="text-center text-muted-foreground">
            Bookmark your favorite snippets and organize them into collections
          </p>
        </div>
      </section>

      {/* Featured Snippets Section */}
      <section className="container py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Featured Snippets
          </h2>
          <Link href="/snippets">
            <Button variant="ghost">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder for snippet cards */}
          <div className="rounded-lg border p-6">
            <h3 className="font-semibold">Loading snippets...</h3>
          </div>
        </div>
      </section>
    </div>
  );
}

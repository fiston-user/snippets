"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Code2, GitBranch, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

const avatars = [
  {
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?&w=64&h=64&dpr=2&q=70&crop=faces&fit=crop",
    alt: "Developer 1",
  },
  {
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?&w=64&h=64&dpr=2&q=70&crop=faces&fit=crop",
    alt: "Developer 2",
  },
  {
    image:
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?&w=64&h=64&dpr=2&q=70&crop=faces&fit=crop",
    alt: "Developer 3",
  },
  {
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?&w=64&h=64&dpr=2&q=70&crop=faces&fit=crop",
    alt: "Developer 4",
  },
];

export default function HomePage() {
  const { data: session } = useSession();
  const [snippets, setSnippets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await fetch("/api/snippets?sort=likes&limit=3");
        if (response.ok) {
          const data = await response.json();
          setSnippets(data);
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
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      {/* Hero section */}
      <div className="container relative">
        <div className="flex flex-col items-center text-center py-24">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-8 max-w-[800px]"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center justify-center gap-2 text-sm text-primary font-medium bg-primary/10 w-fit mx-auto py-1 px-3 rounded-full"
              >
                <Icons.sparkles className="h-4 w-4" />
                <span>Share your code with the world</span>
              </motion.div>
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Share & Discover
                <span className="block text-primary">Code Snippets</span>
              </motion.h1>
              <motion.p
                className="text-lg text-muted-foreground max-w-[600px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                A modern platform for developers to share, discover, and reuse
                code snippets. Save time and improve your workflow with our
                curated collection.
              </motion.p>
            </div>

            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {session?.user ? (
                <Button size="lg" className="h-12 px-6" asChild>
                  <Link href="/snippets/create">
                    <Icons.add className="mr-2 h-5 w-5" />
                    Create Snippet
                  </Link>
                </Button>
              ) : (
                <Button size="lg" className="h-12 px-6" asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              )}
              <Button size="lg" variant="outline" className="h-12 px-6" asChild>
                <Link href="/snippets">Browse Snippets</Link>
              </Button>
            </motion.div>

            <motion.div
              className="flex items-center gap-4 text-sm text-muted-foreground dark:bg-muted/50 bg-gray-200 rounded-full py-2 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex -space-x-2">
                {avatars.map((avatar, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-background relative overflow-hidden"
                  >
                    <Image
                      src={avatar.image}
                      alt={avatar.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <p>Join thousands of developers sharing their code</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-3xl mx-auto pb-24"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="flex flex-col items-center text-center space-y-3 group"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Snippets */}
        <div className="py-24 border-t">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-sm text-primary font-medium bg-primary/10 py-1 px-3 rounded-full mb-4"
            >
              <Icons.sparkles className="h-4 w-4" />
              <span>Featured Snippets</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl font-bold tracking-tight mb-4"
            >
              Popular Code Snippets
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground max-w-[600px] mx-auto"
            >
              Discover the most useful and popular code snippets from our
              community
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {isLoading
              ? [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border bg-card p-6 space-y-4 animate-pulse"
                  >
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-5/6" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-muted rounded-full" />
                      <div className="h-6 w-16 bg-muted rounded-full" />
                    </div>
                  </div>
                ))
              : snippets.map((snippet: any) => (
                  <Link
                    key={snippet.id}
                    href={`/snippets/${snippet.id}`}
                    className="group rounded-xl border bg-card p-6 space-y-4 transition-all hover:shadow-lg hover:bg-accent/50"
                  >
                    <div className="space-y-2">
                      <h3 className="font-semibold line-clamp-1 group-hover:text-accent-foreground">
                        {snippet.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {snippet.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={snippet.author?.image} />
                          <AvatarFallback>
                            {snippet.author?.name?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          {snippet.author?.name}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(snippet.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="rounded-full">
                        {snippet.language}
                      </Badge>
                      {snippet.framework && (
                        <Badge variant="outline" className="rounded-full">
                          {snippet.framework}
                        </Badge>
                      )}
                    </div>
                  </Link>
                ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center mt-12"
          >
            <Button variant="outline" size="lg" className="h-12 px-6" asChild>
              <Link href="/snippets">
                View All Snippets
                <Icons.arrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    title: "Share Code",
    description: "Share your code snippets instantly with a single click.",
    icon: Share2,
  },
  {
    title: "Syntax Highlight",
    description: "Beautiful syntax highlighting for all languages.",
    icon: Code2,
  },
  {
    title: "Version Control",
    description: "Keep track of your snippet changes and history.",
    icon: GitBranch,
  },
];

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { useSession } from "next-auth/react";
import { UserMenu } from "./user-menu";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Icons.logo className="h-6 w-6" />
            <span className="font-bold">CodeSnippets</span>
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            <Link
              href="/snippets"
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground/80",
                isActive("/snippets") ? "text-foreground" : "text-foreground/60"
              )}
            >
              Browse
            </Link>
            {session?.user && (
              <Link
                href="/snippets/my"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground/80",
                  isActive("/snippets/my")
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                My Snippets
              </Link>
            )}
            <Link
              href="/categories"
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground/80",
                isActive("/categories")
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              Categories
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {session?.user && (
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex"
              onClick={() => (window.location.href = "/snippets/create")}
            >
              <Icons.add className="mr-2 h-4 w-4" />
              Create
            </Button>
          )}
          <ModeToggle />
          {status === "loading" ? (
            <Button variant="ghost" size="icon" disabled>
              <Icons.spinner className="h-4 w-4 animate-spin" />
            </Button>
          ) : session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

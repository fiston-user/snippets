"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { useSession } from "next-auth/react";
import { UserMenu } from "./user-menu";
import { Icons } from "./icons";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="font-bold">CodeSnippets</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/snippets">Browse</Link>
            {session?.user && <Link href="/snippets/create">Create</Link>}
            <Link href="/categories">Categories</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="outline" className="inline-flex items-center">
              <Icons.search className="mr-2 h-4 w-4" />
              Search snippets...
            </Button>
          </div>
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            {status === "loading" ? (
              <Button variant="ghost" size="icon" disabled>
                <Icons.spinner className="h-4 w-4 animate-spin" />
              </Button>
            ) : session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

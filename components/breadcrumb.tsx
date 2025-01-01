"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumb() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => ({
      title: segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      href: `/${segment}`,
    }));

  // Build cumulative paths for each segment
  const breadcrumbs = segments.map((segment, index) => ({
    ...segment,
    href:
      "/" +
      segments
        .slice(0, index + 1)
        .map((s) => s.title.toLowerCase().replace(/ /g, "-"))
        .join("/"),
  }));

  return (
    <div className="container flex h-10 items-center space-x-1 text-sm text-muted-foreground">
      <Link href="/" className="transition-colors hover:text-foreground">
        Home
      </Link>
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          <ChevronRight className="mx-1 h-4 w-4" />
          <Link
            href={breadcrumb.href}
            className={cn(
              "transition-colors hover:text-foreground",
              index === breadcrumbs.length - 1 && "text-foreground font-medium"
            )}
          >
            {breadcrumb.title}
          </Link>
        </div>
      ))}
    </div>
  );
}

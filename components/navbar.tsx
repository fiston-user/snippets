"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { useSession } from "next-auth/react";
import { UserMenu } from "./user-menu";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/snippets", label: "Browse", icon: Icons.search },
  {
    href: "/snippets/my",
    label: "My Snippets",
    requiresAuth: true,
    icon: Icons.post,
  },
  { href: "/categories", label: "Categories", icon: Icons.laptop },
];

const MotionLink = motion(Link);

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto">
        <nav className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <MotionLink
              href="/"
              className="group flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className="relative"
              >
                <Icons.logo className="h-6 w-6 transition-transform duration-300 group-hover:rotate-180" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                />
              </motion.div>
              <motion.span
                className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                CodeSnippets
              </motion.span>
            </MotionLink>

            <div className="hidden items-center gap-1 md:flex">
              <AnimatePresence>
                {navItems.map((item) =>
                  !item.requiresAuth || session?.user ? (
                    <MotionLink
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group relative rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-foreground/80",
                        isActive(item.href)
                          ? "text-foreground"
                          : "text-foreground/60"
                      )}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      <span className="relative z-10 flex items-center gap-1.5">
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </span>
                      {isActive(item.href) && (
                        <motion.div
                          className="absolute inset-0 rounded-lg bg-primary/10"
                          layoutId="navbar-active"
                          transition={{ type: "spring", bounce: 0.25 }}
                        />
                      )}
                    </MotionLink>
                  ) : null
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {session?.user && (
              <Button
                variant="ghost"
                size="sm"
                className="hidden gap-2 md:inline-flex group"
                onClick={() => (window.location.href = "/snippets/create")}
              >
                <Icons.add className="h-4 w-4 transition-transform group-hover:rotate-90" />
                <span className="font-medium">Create</span>
              </Button>
            )}

            <div className="flex items-center gap-2">
              <ModeToggle />
              <AnimatePresence mode="wait">
                {status === "loading" ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Button variant="ghost" size="icon" disabled>
                      <Icons.spinner className="h-4 w-4 animate-spin" />
                    </Button>
                  </motion.div>
                ) : session?.user ? (
                  <motion.div
                    key="user-menu"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <UserMenu user={session.user} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="auth-buttons"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Button variant="ghost" size="sm" className="group" asChild>
                      <Link href="/auth/signin">
                        <span className="relative">
                          Sign In
                          <span className="absolute inset-x-0 -bottom-0.5 h-px w-0 bg-foreground/60 transition-all group-hover:w-full" />
                        </span>
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="relative overflow-hidden shadow-lg transition-all hover:shadow-md active:scale-95"
                      asChild
                    >
                      <Link href="/auth/signup">
                        <motion.span
                          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10"
                          initial={{ x: "100%" }}
                          whileHover={{ x: "-100%" }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "linear",
                          }}
                        />
                        <span className="relative">Sign Up</span>
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </nav>
      </div>
    </motion.header>
  );
}

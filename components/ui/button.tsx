import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-xl text-sm font-medium transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform",
    "before:absolute before:inset-0 before:rounded-[inherit] before:transition-all before:duration-300",
    "active:before:duration-[50ms]",
    "group overflow-hidden",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground",
          "shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_5px_15px_-3px_rgba(0,0,0,0.1)]",
          "before:bg-black/[0.04] hover:before:bg-black/[0.06] before:opacity-0 hover:before:opacity-100",
          "active:scale-[0.98] active:before:bg-black/[0.08]",
          "[&_svg]:group-hover:translate-x-0.5",
        ].join(" "),
        destructive: [
          "bg-gradient-to-br from-destructive to-destructive/90 text-destructive-foreground",
          "shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_5px_15px_-3px_rgba(0,0,0,0.1)]",
          "before:bg-black/[0.04] hover:before:bg-black/[0.06] before:opacity-0 hover:before:opacity-100",
          "active:scale-[0.98] active:before:bg-black/[0.08]",
          "[&_svg]:group-hover:translate-x-0.5",
        ].join(" "),
        outline: [
          "border-2 border-input bg-background/50 backdrop-blur",
          "hover:border-primary/50 hover:bg-accent/50 hover:text-accent-foreground",
          "before:bg-primary/[0.03] hover:before:bg-primary/[0.06] before:opacity-0 hover:before:opacity-100",
          "active:scale-[0.98] active:before:bg-primary/[0.08]",
          "[&_svg]:group-hover:translate-x-0.5",
          "shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_5px_15px_-3px_rgba(0,0,0,0.1)]",
        ].join(" "),
        secondary: [
          "bg-gradient-to-br from-secondary to-secondary/90 text-secondary-foreground",
          "shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_5px_15px_-3px_rgba(0,0,0,0.1)]",
          "before:bg-black/[0.04] hover:before:bg-black/[0.06] before:opacity-0 hover:before:opacity-100",
          "active:scale-[0.98] active:before:bg-black/[0.08]",
          "[&_svg]:group-hover:translate-x-0.5",
        ].join(" "),
        ghost: [
          "hover:bg-accent/50 hover:text-accent-foreground",
          "before:bg-primary/[0.03] hover:before:bg-primary/[0.06] before:opacity-0 hover:before:opacity-100",
          "active:scale-[0.98] active:before:bg-primary/[0.08]",
          "[&_svg]:group-hover:translate-x-0.5",
        ].join(" "),
        link: [
          "text-primary underline-offset-4",
          "hover:underline hover:underline-offset-[6px]",
          "[&_svg]:group-hover:translate-x-1",
        ].join(" "),
        shine: [
          "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground",
          "shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_5px_15px_-3px_rgba(0,0,0,0.1)]",
          "before:absolute before:inset-0 before:-z-10 before:translate-x-[150%]",
          "before:rotate-[-45deg] before:bg-gradient-to-r before:from-transparent before:via-white/30",
          "hover:before:translate-x-[-150%] before:transition-[transform] before:duration-[600ms]",
          "active:scale-[0.98] active:before:bg-black/[0.08]",
          "[&_svg]:group-hover:translate-x-0.5",
        ].join(" "),
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-4 text-xs [&_svg]:size-3.5",
        lg: "h-12 rounded-3xl px-8 text-base [&_svg]:size-5",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

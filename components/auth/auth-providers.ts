import { Icons } from "@/components/icons";

export interface Provider {
  id: string;
  name: string;
  icon: keyof typeof Icons;
  variant?: "default" | "outline" | "secondary";
}

export const providers: Provider[] = [
  {
    id: "github",
    name: "GitHub",
    icon: "gitHub",
    variant: "outline",
  },
  // Add more providers here
  // Example:
//   {
//     id: "google",
//     name: "Google",
//     icon: "google",
//     variant: "outline",
//   },
];

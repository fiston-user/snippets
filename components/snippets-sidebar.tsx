import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

interface SnippetsSidebarProps {
  className?: string;
  isOpen: boolean;
  onToggle: () => void;
  selectedLanguage: string;
  selectedFramework: string;
  sortBy: string;
  languages: string[];
  frameworks: string[];
  onLanguageChange: (value: string) => void;
  onFrameworkChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export function SnippetsSidebar({
  className,
  isOpen,
  onToggle,
  selectedLanguage,
  selectedFramework,
  sortBy,
  languages,
  frameworks,
  onLanguageChange,
  onFrameworkChange,
  onSortChange,
}: SnippetsSidebarProps) {
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-[250px] transform overflow-y-auto border-r bg-background px-4 pb-10 pt-20 transition-transform duration-200 md:sticky md:top-14 md:z-0 md:block md:transform-none md:transition-none",
        !isOpen && "-translate-x-full",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between md:hidden">
        <h2 className="font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Language</label>
          <Select value={selectedLanguage} onValueChange={onLanguageChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Languages" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang.toLowerCase()}>
                  {lang === "all" ? "All Languages" : lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Framework</label>
          <Select value={selectedFramework} onValueChange={onFrameworkChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Frameworks" />
            </SelectTrigger>
            <SelectContent>
              {frameworks.map((framework) => (
                <SelectItem key={framework} value={framework.toLowerCase()}>
                  {framework === "all" ? "All Frameworks" : framework}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Sort By</label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

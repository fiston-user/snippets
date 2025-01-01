import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "Ruby",
  "Go",
  "Rust",
  "PHP",
  "Swift",
];

const FRAMEWORKS = [
  "React",
  "Vue",
  "Angular",
  "Next.js",
  "Nuxt",
  "Svelte",
  "Express",
  "Django",
  "Spring",
  "Laravel",
];

const CATEGORIES = [
  "Utility Functions",
  "Components",
  "Hooks",
  "Algorithms",
  "Data Structures",
  "API",
  "Database",
  "Authentication",
  "Testing",
  "DevOps",
];

interface FiltersSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  search: string;
  language: string;
  framework: string;
  category: string;
  onSearchChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onFrameworkChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onReset: () => void;
}

export function FiltersSidebar({
  isOpen,
  onClose,
  search,
  language,
  framework,
  category,
  onSearchChange,
  onLanguageChange,
  onFrameworkChange,
  onCategoryChange,
  onReset,
}: FiltersSidebarProps) {
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-full flex-col overflow-y-auto border-r bg-background px-6 pb-6 pt-24 shadow-lg transition-transform lg:sticky lg:top-[65px] lg:z-0 lg:h-[calc(100vh-65px)] lg:w-auto lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <h2 className="font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search snippets..."
              className="pl-8"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Language Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Language</label>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Languages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Framework Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Framework</label>
          <Select value={framework} onValueChange={onFrameworkChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Frameworks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Frameworks</SelectItem>
              {FRAMEWORKS.map((fw) => (
                <SelectItem key={fw} value={fw}>
                  {fw}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filters */}
        <Button variant="outline" className="w-full" onClick={onReset}>
          <X className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
}

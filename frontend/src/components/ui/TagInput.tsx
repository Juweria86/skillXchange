import { X } from "lucide-react";
import Input from "@/components/ui/Input";
import { cn } from "@/lib/utils"; // Optional utility for class merging

interface TagInputProps {
  label?: string;
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ label, tags, setTags, placeholder }: TagInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      e.currentTarget.value = "";
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div>
      {label && <label className="mb-1 block text-sm font-medium">{label}</label>}
      <div className="flex flex-wrap gap-2 rounded-md border border-input p-2 focus-within:ring-2 focus-within:ring-ring">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <Input
          type="text"
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 border-none p-0 shadow-none focus-visible:ring-0"
        />
      </div>
    </div>
  );
}

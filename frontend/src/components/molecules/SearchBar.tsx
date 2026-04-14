import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar produtos...",
}: SearchBarProps) {
  return (
    <div className="relative max-w-sm flex-1">
      <Search
        size={15}
        className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-9 pl-9"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2"
          onClick={() => onChange("")}
          aria-label="Limpar busca"
        >
          <X size={12} />
        </Button>
      )}
    </div>
  )
}

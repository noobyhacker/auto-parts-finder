import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";

interface PartSortProps {
  value: string;
  onChange: (value: string) => void;
}

export function PartSort({ value, onChange }: PartSortProps) {
  const { t } = useLanguage();

  const sortOptions = [
    { value: "createdAt:desc", label: t.sort.newestFirst },
    { value: "price:asc", label: t.sort.priceAsc },
    { value: "price:desc", label: t.sort.priceDesc },
    { value: "name:asc", label: t.sort.nameAsc },
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] bg-input">
        <SelectValue placeholder={t.sort.sortBy} />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

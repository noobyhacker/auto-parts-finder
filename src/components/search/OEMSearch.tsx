import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

export function OEMSearch() {
  const [oemNumber, setOemNumber] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSearch = () => {
    if (oemNumber.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(oemNumber.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t.vehicle.enterOEM}
            value={oemNumber}
            onChange={(e) => setOemNumber(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} disabled={!oemNumber.trim()}>
          {t.common.search}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {t.vehicle.oemHint}
      </p>
    </div>
  );
}

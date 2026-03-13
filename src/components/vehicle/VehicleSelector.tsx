import { useState, useEffect } from "react";
import { ChevronRight, Check, RotateCcw, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBrands, useModels, useYears, useEngines } from "@/hooks/useQueries";
import { useLanguage } from "@/hooks/useLanguage";
import type { VehicleSelection } from "@/types";

interface VehicleSelectorProps {
  onSelect: (selection: VehicleSelection) => void;
  showButton?: boolean;
  instantFilter?: boolean;
  initialValues?: {
    brandId?: string;
    modelId?: string;
    year?: number;
    engine?: string;
  };
}

export function VehicleSelector({ 
  onSelect, 
  showButton = true, 
  instantFilter = true,
  initialValues 
}: VehicleSelectorProps) {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(initialValues?.brandId || null);
  const [selectedModel, setSelectedModel] = useState<string | null>(initialValues?.modelId || null);
  const [selectedYear, setSelectedYear] = useState<number | null>(initialValues?.year || null);
  const [selectedEngine, setSelectedEngine] = useState<string | null>(initialValues?.engine || null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { t } = useLanguage();

  // React Query cached data
  const { data: brands = [] } = useBrands();
  const { data: models = [] } = useModels(selectedBrand);
  const { data: years = [] } = useYears(selectedModel);
  const { data: engines = [] } = useEngines(selectedModel, selectedYear);

  // Notify parent of selection changes immediately (for instant filtering)
  useEffect(() => {
    if (!instantFilter || !hasInteracted) return;
    onSelect({
      brandId: selectedBrand || undefined,
      modelId: selectedModel || undefined,
      year: selectedYear || undefined,
      engine: selectedEngine || undefined,
    });
  }, [selectedBrand, selectedModel, selectedYear, selectedEngine, hasInteracted, instantFilter]);

  const handleBrandChange = (v: string) => {
    setHasInteracted(true);
    setSelectedBrand(v);
    setSelectedModel(null);
    setSelectedYear(null);
    setSelectedEngine(null);
  };

  const handleModelChange = (v: string) => {
    setHasInteracted(true);
    setSelectedModel(v);
    setSelectedYear(null);
    setSelectedEngine(null);
  };

  const handleYearChange = (v: string) => {
    setHasInteracted(true);
    setSelectedYear(Number(v));
    setSelectedEngine(null);
  };

  const handleEngineChange = (v: string) => {
    setHasInteracted(true);
    setSelectedEngine(v);
  };

  const handleReset = () => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedYear(null);
    setSelectedEngine(null);
  };

  const getStepStatus = (step: number) => {
    if (step === 1) return selectedBrand ? "completed" : "active";
    if (step === 2) return selectedModel ? "completed" : selectedBrand ? "active" : "pending";
    if (step === 3) return selectedYear ? "completed" : selectedModel ? "active" : "pending";
    if (step === 4) return selectedEngine ? "completed" : selectedYear ? "active" : "pending";
    return "pending";
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              getStepStatus(1) === "completed" ? "bg-success text-success-foreground" : 
              getStepStatus(1) === "active" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}>
              {getStepStatus(1) === "completed" ? <Check className="h-3 w-3" /> : "1"}
            </span>
            {t.vehicle.brand}
          </label>
          <Select
            value={selectedBrand || ""}
            onValueChange={handleBrandChange}
          >
            <SelectTrigger className="bg-input">
              <SelectValue placeholder={t.vehicle.selectBrand} />
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-[300px]">
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Model */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              getStepStatus(2) === "completed" ? "bg-success text-success-foreground" : 
              getStepStatus(2) === "active" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}>
              {getStepStatus(2) === "completed" ? <Check className="h-3 w-3" /> : "2"}
            </span>
            {t.vehicle.model}
          </label>
          <Select
            value={selectedModel || ""}
            onValueChange={handleModelChange}
            disabled={!selectedBrand}
          >
            <SelectTrigger className="bg-input">
              <SelectValue placeholder={t.vehicle.selectModel} />
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-[300px]">
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              getStepStatus(3) === "completed" ? "bg-success text-success-foreground" : 
              getStepStatus(3) === "active" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}>
              {getStepStatus(3) === "completed" ? <Check className="h-3 w-3" /> : "3"}
            </span>
            {t.vehicle.year}
          </label>
          <Select
            value={selectedYear?.toString() || ""}
            onValueChange={handleYearChange}
            disabled={!selectedModel}
          >
            <SelectTrigger className="bg-input">
              <SelectValue placeholder={t.vehicle.selectYear} />
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-[300px]">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Engine (Optional) */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground min-w-0">
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              getStepStatus(4) === "completed" ? "bg-success text-success-foreground" : 
              getStepStatus(4) === "active" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}>
              {getStepStatus(4) === "completed" ? <Check className="h-3 w-3" /> : "4"}
            </span>
            {t.vehicle.engine}
          </label>
          <Select
            value={selectedEngine || ""}
            onValueChange={handleEngineChange}
            disabled={!selectedYear || engines.length === 0}
          >
            <SelectTrigger className="bg-input">
              <SelectValue placeholder={engines.length === 0 && selectedYear ? "—" : t.vehicle.selectEngine} />
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-[300px]">
              {engines.map((engine) => (
                <SelectItem key={engine} value={engine}>
                  {engine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Actions */}
      {showButton && (
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => {
              setHasInteracted(true);
              onSelect({
                brandId: selectedBrand || undefined,
                modelId: selectedModel || undefined,
                year: selectedYear || undefined,
                engine: selectedEngine || undefined,
              });
            }}
            className="gap-2 btn-glow"
          >
            <Car className="h-4 w-4" />
            {t.nav.catalog}
            <ChevronRight className="h-4 w-4" />
          </Button>

          {(selectedBrand || selectedModel || selectedYear) && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2 text-muted-foreground">
              <RotateCcw className="h-4 w-4" />
              {t.vehicle.reset}
            </Button>
          )}
        </div>
      )}

      {/* Reset button when showButton is false */}
      {!showButton && (selectedBrand || selectedModel || selectedYear) && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2 text-muted-foreground">
            <RotateCcw className="h-4 w-4" />
            {t.vehicle.reset}
          </Button>
        </div>
      )}
    </div>
  );
}

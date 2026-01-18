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
import { getBrands, getModels, getYears, getEngines } from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";
import type { Brand, Model, VehicleSelection } from "@/types";

interface VehicleSelectorProps {
  onSelect: (selection: VehicleSelection) => void;
  showButton?: boolean;
}

export function VehicleSelector({ onSelect, showButton = true }: VehicleSelectorProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [engines, setEngines] = useState<string[]>([]);

  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedEngine, setSelectedEngine] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  // Load brands on mount
  useEffect(() => {
    getBrands().then(setBrands);
  }, []);

  // Track if user has interacted with the selector
  const [hasInteracted, setHasInteracted] = useState(false);

  // Notify parent of selection changes immediately (for instant filtering)
  // Only trigger after user has interacted to prevent auto-navigation on mount
  useEffect(() => {
    if (!hasInteracted) return;
    
    onSelect({
      brandId: selectedBrand || undefined,
      modelId: selectedModel || undefined,
      year: selectedYear || undefined,
      engine: selectedEngine || undefined,
    });
  }, [selectedBrand, selectedModel, selectedYear, selectedEngine, hasInteracted]);

  // Load models when brand changes
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // Reset downstream selections whenever brand changes
      setSelectedModel(null);
      setSelectedYear(null);
      setSelectedEngine(null);
      setModels([]);
      setYears([]);
      setEngines([]);

      if (!selectedBrand) {
        return;
      }

      setIsLoading(true);
      try {
        const data = await getModels(selectedBrand);
        if (!cancelled) setModels(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load models:", err);
        if (!cancelled) setModels([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [selectedBrand]);

  // Load years when model changes
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // Reset downstream selections whenever model changes
      setSelectedYear(null);
      setSelectedEngine(null);
      setYears([]);
      setEngines([]);

      if (!selectedModel) {
        return;
      }

      setIsLoading(true);
      try {
        const data = await getYears(selectedModel);
        if (!cancelled) setYears(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load years:", err);
        if (!cancelled) setYears([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [selectedModel]);

  // Load engines when year changes
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // Reset downstream selection whenever year/model changes
      setSelectedEngine(null);
      setEngines([]);

      if (!selectedYear || !selectedModel) {
        return;
      }

      setIsLoading(true);
      try {
        const data = await getEngines(selectedModel, selectedYear);
        if (!cancelled) setEngines(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load engines:", err);
        if (!cancelled) setEngines([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [selectedYear, selectedModel]);

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
            onValueChange={(v) => { setHasInteracted(true); setSelectedBrand(v); }}
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
            onValueChange={(v) => { setHasInteracted(true); setSelectedModel(v); }}
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
            onValueChange={(v) => { setHasInteracted(true); setSelectedYear(Number(v)); }}
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
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              getStepStatus(4) === "completed" ? "bg-success text-success-foreground" : 
              getStepStatus(4) === "active" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}>
              {getStepStatus(4) === "completed" ? <Check className="h-3 w-3" /> : "4"}
            </span>
            {t.vehicle.engine}
            <span className="text-xs text-muted-foreground">({t.vehicle.optional})</span>
          </label>
          <Select
            value={selectedEngine || ""}
            onValueChange={(v) => { setHasInteracted(true); setSelectedEngine(v); }}
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
            onClick={() => onSelect({
              brandId: selectedBrand || undefined,
              modelId: selectedModel || undefined,
              year: selectedYear || undefined,
              engine: selectedEngine || undefined,
            })}
            disabled={!selectedBrand || isLoading}
            className="gap-2 btn-glow"
          >
            <Car className="h-4 w-4" />
            {t.vehicle.findParts}
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

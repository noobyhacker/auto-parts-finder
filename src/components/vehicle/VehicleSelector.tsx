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
import { getMockBrands, getMockModels, getMockYears, getMockEngines } from "@/lib/mock-data";
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

  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedEngine, setSelectedEngine] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Load brands on mount
  useEffect(() => {
    getMockBrands().then(setBrands);
  }, []);

  // Load models when brand changes
  useEffect(() => {
    if (selectedBrand) {
      setIsLoading(true);
      getMockModels(selectedBrand).then((data) => {
        setModels(data);
        setIsLoading(false);
      });
    } else {
      setModels([]);
    }
    setSelectedModel(null);
    setSelectedYear(null);
    setSelectedEngine(null);
  }, [selectedBrand]);

  // Load years when model changes
  useEffect(() => {
    if (selectedModel) {
      setIsLoading(true);
      getMockYears().then((data) => {
        setYears(data);
        setIsLoading(false);
      });
    } else {
      setYears([]);
    }
    setSelectedYear(null);
    setSelectedEngine(null);
  }, [selectedModel]);

  // Load engines when year changes
  useEffect(() => {
    if (selectedYear) {
      setIsLoading(true);
      getMockEngines().then((data) => {
        setEngines(data);
        setIsLoading(false);
      });
    } else {
      setEngines([]);
    }
    setSelectedEngine(null);
  }, [selectedYear]);

  const handleReset = () => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedYear(null);
    setSelectedEngine(null);
  };

  const handleSubmit = () => {
    if (selectedBrand && selectedModel && selectedYear) {
      onSelect({
        brandId: selectedBrand,
        modelId: selectedModel,
        year: selectedYear,
        engine: selectedEngine || undefined,
      });
    }
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
            Brand
          </label>
          <Select
            value={selectedBrand?.toString() || ""}
            onValueChange={(v) => setSelectedBrand(Number(v))}
          >
            <SelectTrigger className="bg-input">
              <SelectValue placeholder="Select brand..." />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id.toString()}>
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
            Model
          </label>
          <Select
            value={selectedModel?.toString() || ""}
            onValueChange={(v) => setSelectedModel(Number(v))}
            disabled={!selectedBrand}
          >
            <SelectTrigger className="bg-input">
              <SelectValue placeholder="Select model..." />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id.toString()}>
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
            Year
          </label>
          <Select
            value={selectedYear?.toString() || ""}
            onValueChange={(v) => setSelectedYear(Number(v))}
            disabled={!selectedModel}
          >
            <SelectTrigger className="bg-input">
              <SelectValue placeholder="Select year..." />
            </SelectTrigger>
            <SelectContent>
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
            Engine
            <span className="text-xs text-muted-foreground">(optional)</span>
          </label>
          <Select
            value={selectedEngine || ""}
            onValueChange={setSelectedEngine}
            disabled={!selectedYear}
          >
            <SelectTrigger className="bg-input">
              <SelectValue placeholder="Select engine..." />
            </SelectTrigger>
            <SelectContent>
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
            onClick={handleSubmit}
            disabled={!selectedBrand || !selectedModel || !selectedYear || isLoading}
            className="gap-2 btn-glow"
          >
            <Car className="h-4 w-4" />
            Find Parts
            <ChevronRight className="h-4 w-4" />
          </Button>

          {(selectedBrand || selectedModel || selectedYear) && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2 text-muted-foreground">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

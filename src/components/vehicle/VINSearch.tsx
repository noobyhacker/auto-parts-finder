import { useState } from "react";
import { Search, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidVIN } from "@/lib/api";
import { mockVehicle, delay } from "@/lib/mock-data";
import type { Vehicle } from "@/types";

interface VINSearchProps {
  onVehicleFound: (vehicle: Vehicle) => void;
}

export function VINSearch({ onVehicleFound }: VINSearchProps) {
  const [vin, setVin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundVehicle, setFoundVehicle] = useState<Vehicle | null>(null);

  const handleVinChange = (value: string) => {
    // Only allow valid VIN characters (no I, O, Q)
    const cleaned = value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "").slice(0, 17);
    setVin(cleaned);
    setError(null);
    setFoundVehicle(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidVIN(vin)) {
      setError("Please enter a valid 17-character VIN");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await delay(1000);
      
      // Mock: always return a vehicle for demo
      setFoundVehicle(mockVehicle);
    } catch {
      setError("Failed to decode VIN. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindParts = () => {
    if (foundVehicle) {
      onVehicleFound(foundVehicle);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Input
            value={vin}
            onChange={(e) => handleVinChange(e.target.value)}
            placeholder="Enter your VIN (17 characters)"
            className="bg-input pr-16 font-mono text-sm uppercase tracking-wider"
            maxLength={17}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {vin.length}/17
          </span>
        </div>
        <Button 
          type="submit" 
          disabled={vin.length !== 17 || isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Decode VIN
        </Button>
      </form>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Found Vehicle */}
      {foundVehicle && (
        <div className="rounded-lg border border-success/30 bg-success/5 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-success">Vehicle Found</p>
              <p className="mt-1 text-lg font-display font-bold">
                {foundVehicle.year} {foundVehicle.brand.name} {foundVehicle.model.name}
              </p>
              {foundVehicle.engine && (
                <p className="text-sm text-muted-foreground">Engine: {foundVehicle.engine}</p>
              )}
              <Button 
                onClick={handleFindParts}
                className="mt-3 gap-2 btn-glow"
              >
                Find Compatible Parts
              </Button>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        The VIN is typically located on the driver's side dashboard (visible through the windshield) or on the driver's door jamb.
      </p>
    </div>
  );
}

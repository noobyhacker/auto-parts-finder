import { useNavigate } from "react-router-dom";
import { Search, Car, Shield, Truck, Headphones } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { VehicleSelector } from "@/components/vehicle/VehicleSelector";
import { VINSearch } from "@/components/vehicle/VINSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { VehicleSelection, Vehicle } from "@/types";

const Index = () => {
  const navigate = useNavigate();

  const handleVehicleSelect = (selection: VehicleSelection) => {
    const params = new URLSearchParams();
    if (selection.brandId) params.set("brand", selection.brandId.toString());
    if (selection.modelId) params.set("model", selection.modelId.toString());
    if (selection.year) params.set("year", selection.year.toString());
    if (selection.engine) params.set("engine", selection.engine);
    navigate(`/catalog?${params.toString()}`);
  };

  const handleVINVehicleFound = (vehicle: Vehicle) => {
    const params = new URLSearchParams();
    params.set("vehicleId", vehicle.id.toString());
    navigate(`/catalog?${params.toString()}`);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container-custom relative py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Find Auto Parts
              <span className="block text-primary">By Your Vehicle</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Quality OEM and aftermarket parts for Korean, Japanese, and American vehicles. 
              Fast delivery and expert support.
            </p>
          </div>

          {/* Vehicle Selector / VIN Search */}
          <div className="mx-auto mt-10 max-w-4xl">
            <div className="glass-card p-6 md:p-8">
              <Tabs defaultValue="vehicle" className="space-y-6">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-secondary">
                  <TabsTrigger value="vehicle" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Car className="h-4 w-4" />
                    Select Vehicle
                  </TabsTrigger>
                  <TabsTrigger value="vin" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Search className="h-4 w-4" />
                    VIN Search
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="vehicle" className="mt-6">
                  <VehicleSelector onSelect={handleVehicleSelect} />
                </TabsContent>

                <TabsContent value="vin" className="mt-6">
                  <VINSearch onVehicleFound={handleVINVehicleFound} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="glass-card p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display font-semibold">Fast Shipping</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Same-day dispatch on orders placed before 2 PM
              </p>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display font-semibold">Quality Guaranteed</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                OEM quality parts with warranty included
              </p>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Headphones className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display font-semibold">Expert Support</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Technical assistance from automotive specialists
              </p>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display font-semibold">100K+ Parts</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Extensive catalog covering all major brands
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="border-t border-border/50 py-16 md:py-20">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold md:text-3xl">Browse by Category</h2>
            <p className="mt-2 text-muted-foreground">Find exactly what you need</p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[
              { name: "Engine Parts", icon: "⚙️", slug: "engine-parts" },
              { name: "Brake System", icon: "🛞", slug: "brake-system" },
              { name: "Suspension", icon: "🔧", slug: "suspension" },
              { name: "Filters", icon: "🔲", slug: "filters" },
              { name: "Electrical", icon: "⚡", slug: "electrical" },
              { name: "Body Parts", icon: "🚗", slug: "body-parts" },
              { name: "Cooling System", icon: "❄️", slug: "cooling-system" },
              { name: "Transmission", icon: "🎛️", slug: "transmission" },
            ].map((category) => (
              <a
                key={category.slug}
                href={`/catalog?category=${category.slug}`}
                className="glass-card flex items-center gap-4 p-4 transition-all hover:border-primary/50 hover:bg-secondary/50"
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

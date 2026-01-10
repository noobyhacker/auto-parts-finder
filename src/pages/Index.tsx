import { useNavigate } from "react-router-dom";
import { Search, Car, Shield, Truck, Headphones, ChevronRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { VehicleSelector } from "@/components/vehicle/VehicleSelector";
import { VINSearch } from "@/components/vehicle/VINSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EngineIcon,
  BrakeIcon,
  SuspensionIcon,
  FilterIcon,
  ElectricalIcon,
  BodyIcon,
  CoolingIcon,
  TransmissionIcon,
} from "@/components/icons/CategoryIcons";
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

  const categories = [
    { name: "Engine Parts", Icon: EngineIcon, slug: "engine-parts" },
    { name: "Brake System", Icon: BrakeIcon, slug: "brake-system" },
    { name: "Suspension", Icon: SuspensionIcon, slug: "suspension" },
    { name: "Filters", Icon: FilterIcon, slug: "filters" },
    { name: "Electrical", Icon: ElectricalIcon, slug: "electrical" },
    { name: "Body Parts", Icon: BodyIcon, slug: "body-parts" },
    { name: "Cooling System", Icon: CoolingIcon, slug: "cooling-system" },
    { name: "Transmission", Icon: TransmissionIcon, slug: "transmission" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 animated-grid opacity-30" />
        <div className="absolute inset-0 floating-particles" />
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[96px] animate-pulse-slow" style={{ animationDelay: "1s" }} />

        <div className="container-custom relative py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary mb-6 animate-slide-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Specialists in Korean Auto Parts
            </div>
            
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Find Quality Parts for
              <span className="block text-gradient mt-2">Hyundai • Kia • Genesis</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
              OEM and aftermarket parts for all Korean vehicles. 
              Fast delivery and expert technical support.
            </p>
          </div>

          {/* Vehicle Selector / VIN Search */}
          <div className="mx-auto mt-10 max-w-4xl animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="glass-card p-6 md:p-8 border-primary/20">
              <Tabs defaultValue="vehicle" className="space-y-6">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-secondary">
                  <TabsTrigger value="vehicle" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                    <Car className="h-4 w-4" />
                    Select Vehicle
                  </TabsTrigger>
                  <TabsTrigger value="vin" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
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
      <section className="py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 floating-particles opacity-50" />
        
        <div className="container-custom relative">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Truck, title: "Fast Shipping", desc: "Same-day dispatch on orders placed before 2 PM" },
              { Icon: Shield, title: "Quality Guaranteed", desc: "OEM quality parts with warranty included" },
              { Icon: Headphones, title: "Expert Support", desc: "Technical assistance from automotive specialists" },
              { Icon: Car, title: "100K+ Parts", desc: "Extensive catalog for Korean vehicles" },
            ].map((feature, index) => (
              <div 
                key={feature.title} 
                className="glass-card p-6 text-center group hover:border-primary/50 transition-all duration-500 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <feature.Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mt-4 font-display font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="border-t border-border/50 py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
        
        <div className="container-custom relative">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold md:text-3xl">Browse by Category</h2>
            <p className="mt-2 text-muted-foreground">Find exactly what you need</p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category, index) => (
              <a
                key={category.slug}
                href={`/catalog?category=${category.slug}`}
                className="glass-card flex items-center gap-4 p-4 group transition-all duration-300 hover:border-primary/50 hover:bg-secondary/50 animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <category.Icon className="h-6 w-6 text-primary" />
                </div>
                <span className="font-medium flex-1">{category.name}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="border-t border-border/50 py-16 md:py-20 relative">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-bold md:text-3xl">Korean Brands We Serve</h2>
            <p className="mt-2 text-muted-foreground">Specialized expertise for all major Korean manufacturers</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Hyundai", models: "Sonata, Tucson, Santa Fe, Palisade, Ioniq" },
              { name: "Kia", models: "K5, Sportage, Sorento, Telluride, EV6" },
              { name: "Genesis", models: "G70, G80, G90, GV70, GV80" },
              { name: "SsangYong", models: "Rexton, Korando, Tivoli, Musso" },
            ].map((brand, index) => (
              <div 
                key={brand.name}
                className="glass-card p-6 text-center group hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="font-display text-xl font-bold text-primary">{brand.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{brand.models}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50 py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 animated-grid opacity-20" />
        
        <div className="container-custom relative text-center">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            Have Questions?
          </h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            Our team of Korean vehicle specialists is ready to help you find the right parts
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/about"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border bg-secondary text-foreground font-medium hover:bg-secondary/80 hover:border-primary/50 transition-all"
            >
              About Us
            </a>
            <a
              href="/faq"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border bg-secondary text-foreground font-medium hover:bg-secondary/80 hover:border-primary/50 transition-all"
            >
              FAQ
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium btn-glow hover:opacity-90 transition-opacity"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

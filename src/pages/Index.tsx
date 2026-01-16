import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Shield, Truck, Headphones, ChevronRight, Award, Users, Clock } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { VehicleSelector } from "@/components/vehicle/VehicleSelector";
import { OEMSearch } from "@/components/search/OEMSearch";
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
import { KoreanFlagMini } from "@/components/icons/KoreanFlag";
import { useLanguage } from "@/hooks/useLanguage";
import type { VehicleSelection } from "@/types";

// Memoized feature card for performance
const FeatureCard = memo(({ Icon, title, desc, delay }: { Icon: any; title: string; desc: string; delay: string }) => (
  <div 
    className="glass-card p-6 text-center group hover:border-primary/50 transition-all duration-500 animate-slide-up"
    style={{ animationDelay: delay }}
  >
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
      <Icon className="h-7 w-7 text-primary" />
    </div>
    <h3 className="mt-4 font-display font-semibold">{title}</h3>
    <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
  </div>
));

FeatureCard.displayName = "FeatureCard";

// Memoized category card
const CategoryCard = memo(({ name, Icon, slug, delay }: { name: string; Icon: any; slug: string; delay: string }) => (
  <a
    href={`/catalog?category=${slug}`}
    className="glass-card flex items-center gap-4 p-4 group transition-all duration-300 hover:border-primary/50 hover:bg-secondary/50 animate-scale-in"
    style={{ animationDelay: delay }}
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <span className="font-medium flex-1">{name}</span>
    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
  </a>
));

CategoryCard.displayName = "CategoryCard";

const brands = [
  { name: "Hyundai", models: "Sonata, Tucson, Santa Fe, Palisade, Ioniq" },
  { name: "Kia", models: "K5, Sportage, Sorento, Telluride, EV6" },
  { name: "Genesis", models: "G70, G80, G90, GV70, GV80" },
  { name: "SsangYong", models: "Rexton, Korando, Tivoli, Musso" },
];

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleVehicleSelect = (selection: VehicleSelection) => {
    const params = new URLSearchParams();
    if (selection.brandId) params.set("brand", selection.brandId.toString());
    if (selection.modelId) params.set("model", selection.modelId.toString());
    if (selection.year) params.set("year", selection.year.toString());
    if (selection.engine) params.set("engine", selection.engine);
    navigate(`/catalog?${params.toString()}`);
  };

  const categories = [
    { name: t.categories.engine, Icon: EngineIcon, slug: "engine-parts" },
    { name: t.categories.brake, Icon: BrakeIcon, slug: "brake-system" },
    { name: t.categories.suspension, Icon: SuspensionIcon, slug: "suspension" },
    { name: t.categories.filters, Icon: FilterIcon, slug: "filters" },
    { name: t.categories.electrical, Icon: ElectricalIcon, slug: "electrical" },
    { name: t.categories.body, Icon: BodyIcon, slug: "body-parts" },
    { name: t.categories.cooling, Icon: CoolingIcon, slug: "cooling-system" },
    { name: t.categories.transmission, Icon: TransmissionIcon, slug: "transmission" },
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
              <KoreanFlagMini className="h-4 w-6" />
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {t.hero.badge}
            </div>
            
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
              {t.hero.title}
              <span className="block text-gradient mt-2">{t.hero.titleBrands}</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
              {t.hero.subtitle}
            </p>
          </div>

          {/* Vehicle Selector with Tabs */}
          <div className="mx-auto mt-10 max-w-4xl animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="glass-card p-6 md:p-8 border-primary/20">
              <Tabs defaultValue="vehicle" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="vehicle">{t.hero.selectVehicle}</TabsTrigger>
                  <TabsTrigger value="oem">{t.vehicle.searchByOEM}</TabsTrigger>
                </TabsList>
                <TabsContent value="vehicle">
                  <VehicleSelector onSelect={handleVehicleSelect} />
                </TabsContent>
                <TabsContent value="oem">
                  <OEMSearch />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 md:py-20 border-b border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        
        <div className="container-custom relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <KoreanFlagMini className="h-5 w-8 rounded shadow-sm" />
                <span className="text-sm text-primary font-medium">{t.about.badge}</span>
              </div>
              <h2 className="font-display text-2xl font-bold md:text-3xl lg:text-4xl">
                {t.about.title}
                <span className="text-gradient block">{t.about.titleHighlight}</span>
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground">
                <p>{t.about.description1}</p>
                <p>{t.about.description2}</p>
              </div>
              <a
                href="/about"
                className="mt-6 inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                {t.about.learnMore}
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-6 text-center animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-display font-bold text-primary">14+</div>
                <div className="mt-1 text-sm text-muted-foreground">{t.about.stats.years}</div>
              </div>
              <div className="glass-card p-6 text-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-display font-bold text-primary">100K+</div>
                <div className="mt-1 text-sm text-muted-foreground">{t.about.stats.parts}</div>
              </div>
              <div className="glass-card p-6 text-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-display font-bold text-primary">50K+</div>
                <div className="mt-1 text-sm text-muted-foreground">{t.about.stats.customers}</div>
              </div>
              <div className="glass-card p-6 text-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-display font-bold text-primary">24h</div>
                <div className="mt-1 text-sm text-muted-foreground">{t.about.stats.dispatch}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 floating-particles opacity-50" />
        
        <div className="container-custom relative">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard Icon={Truck} title={t.features.shipping} desc={t.features.shippingDesc} delay="0s" />
            <FeatureCard Icon={Shield} title={t.features.quality} desc={t.features.qualityDesc} delay="0.1s" />
            <FeatureCard Icon={Headphones} title={t.features.support} desc={t.features.supportDesc} delay="0.2s" />
            <FeatureCard Icon={Car} title={t.features.catalog} desc={t.features.catalogDesc} delay="0.3s" />
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="border-t border-border/50 py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
        
        <div className="container-custom relative">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold md:text-3xl">{t.categories.title}</h2>
            <p className="mt-2 text-muted-foreground">{t.categories.subtitle}</p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category, index) => (
              <CategoryCard 
                key={category.slug} 
                {...category} 
                delay={`${index * 0.05}s`} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="border-t border-border/50 py-16 md:py-20 relative">
        <div className="container-custom">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <KoreanFlagMini className="h-4 w-6 rounded shadow-sm" />
              <span className="text-sm text-muted-foreground">{t.brands.badge}</span>
            </div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">{t.brands.title}</h2>
            <p className="mt-2 text-muted-foreground">{t.brands.subtitle}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {brands.map((brand, index) => (
              <div 
                key={brand.name}
                className="glass-card p-6 text-center group hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <KoreanFlagMini className="h-3 w-5 opacity-60" />
                  <h3 className="font-display text-xl font-bold text-primary">{brand.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{brand.models}</p>
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
            {t.cta.title}
          </h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            {t.cta.subtitle}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/about"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border bg-secondary text-foreground font-medium hover:bg-secondary/80 hover:border-primary/50 transition-all"
            >
              {t.cta.aboutUs}
            </a>
            <a
              href="/faq"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border bg-secondary text-foreground font-medium hover:bg-secondary/80 hover:border-primary/50 transition-all"
            >
              {t.cta.faq}
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium btn-glow hover:opacity-90 transition-opacity"
            >
              {t.cta.contactUs}
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

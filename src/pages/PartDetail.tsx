import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Package, Check, Car, Send, MessageCircle, Phone } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { getMockPart, mockVehicle } from "@/lib/mock-data";
import { useLanguage } from "@/hooks/useLanguage";
import type { Part } from "@/types";

// Map category slugs to translation keys
const categoryTranslationMap: Record<string, keyof typeof import("@/lib/i18n").translations.en.categories> = {
  "engine-parts": "engine",
  "brake-system": "brake",
  "suspension": "suspension",
  "filters": "filters",
  "electrical": "electrical",
  "body-parts": "body",
  "cooling-system": "cooling",
  "transmission": "transmission",
};

// Map part slugs to translation keys
const partNameTranslationMap: Record<string, keyof typeof import("@/lib/i18n").translations.en.partNames> = {
  "engine-oil-filter-263203c30a": "engineOilFilter",
  "front-brake-pads-581012ta00": "frontBrakePadsSet",
  "air-filter-281133x000": "airFilterElement",
  "shock-absorber-front-546513s500": "shockAbsorberFrontLeft",
  "spark-plug-set-1884611070": "sparkPlugSet",
  "timing-belt-kit-243122g400": "timingBeltKit",
  "radiator-assembly-253103s050": "radiatorAssembly",
  "alternator-373002g150": "alternator",
};

const PartDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [part, setPart] = useState<Part | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchPart = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const data = await getMockPart(slug);
        setPart(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPart();
  }, [slug]);

  const getCategoryName = (categorySlug: string) => {
    const key = categoryTranslationMap[categorySlug];
    if (key && t.categories[key]) {
      return t.categories[key];
    }
    return categorySlug;
  };

  const getPartName = (partSlug: string, fallbackName: string) => {
    const key = partNameTranslationMap[partSlug];
    if (key && t.partNames[key]) {
      return t.partNames[key];
    }
    return fallbackName;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-32 rounded bg-secondary" />
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="aspect-square rounded-lg bg-secondary" />
              <div className="space-y-4">
                <div className="h-6 w-24 rounded bg-secondary" />
                <div className="h-10 w-3/4 rounded bg-secondary" />
                <div className="h-6 w-32 rounded bg-secondary" />
                <div className="h-12 w-40 rounded bg-secondary" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!part) {
    return (
      <Layout>
        <div className="container-custom flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
          <Package className="h-16 w-16 text-muted-foreground/30" />
          <h1 className="mt-4 font-display text-2xl font-bold">{t.common.partNotFound}</h1>
          <p className="mt-2 text-muted-foreground">
            {t.common.partNotFoundDesc}
          </p>
          <Button className="mt-6" onClick={() => navigate("/catalog")}>
            {t.common.browseCatalog}
          </Button>
        </div>
      </Layout>
    );
  }

  const partName = getPartName(part.slug, part.name);

  // Mock compatible vehicles
  const compatibleVehicles = [
    { ...mockVehicle, id: 1 },
    { ...mockVehicle, id: 2, year: 2020 },
    { ...mockVehicle, id: 3, year: 2019 },
  ];

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <Link
          to="/catalog"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {t.common.backToCatalog}
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border border-border/50 bg-card">
              {part.images[selectedImage] ? (
                <img
                  src={part.images[selectedImage].url}
                  alt={partName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package className="h-24 w-24 text-muted-foreground/30" />
                </div>
              )}
            </div>
            
            {part.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {part.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImage === index ? "border-primary" : "border-border/50"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${partName} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-primary">{getCategoryName(part.category.slug)}</p>
              <h1 className="mt-1 font-display text-2xl font-bold md:text-3xl">{partName}</h1>
            </div>

            {/* Article Numbers */}
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="text-xs text-muted-foreground">{t.common.articleNumber}</p>
                <p className="font-mono text-sm font-semibold">{part.articleNumber}</p>
              </div>
              {part.oemNumber && (
                <div>
                  <p className="text-xs text-muted-foreground">{t.common.oemNumber}</p>
                  <p className="font-mono text-sm font-semibold">{part.oemNumber}</p>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-4">
              <span className={`stock-badge ${part.inStock ? 'in-stock' : 'out-of-stock'}`}>
                {part.inStock ? (
                  <>
                    <Check className="h-3 w-3" />
                    {t.common.inStock}
                  </>
                ) : (
                  t.common.outOfStock
                )}
              </span>
            </div>

            {/* Description */}
            {part.description && (
              <div>
                <h3 className="mb-2 text-sm font-semibold">{t.common.description}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {part.description}
                </p>
              </div>
            )}

            {/* Contact Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">{t.common.contactAboutPart}</h3>
              <div className="flex flex-wrap gap-3">
                <Button 
                  className="gap-2 bg-[#0088cc] hover:bg-[#0088cc]/90"
                  onClick={() => {
                    const message = encodeURIComponent(`Hi! I'm interested in: ${partName} (Article: ${part.articleNumber})`);
                    window.open(`https://t.me/your_telegram_handle?text=${message}`, '_blank');
                  }}
                >
                  <Send className="h-4 w-4" />
                  Telegram
                </Button>
                <Button 
                  className="gap-2 bg-[#25D366] hover:bg-[#25D366]/90"
                  onClick={() => {
                    const message = encodeURIComponent(`Hi! I'm interested in: ${partName} (Article: ${part.articleNumber})`);
                    window.open(`https://wa.me/your_phone_number?text=${message}`, '_blank');
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
                <Button 
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    const message = encodeURIComponent(`Hi! I'm interested in: ${partName} (Article: ${part.articleNumber})`);
                    window.open(`https://max.com/your_max_handle?text=${message}`, '_blank');
                  }}
                >
                  <Phone className="h-4 w-4" />
                  MAX
                </Button>
              </div>
            </div>

            {/* Compatible Vehicles */}
            <div className="rounded-lg border border-border/50 bg-card/50 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Car className="h-4 w-4 text-primary" />
                {t.common.compatibleVehicles}
              </h3>
              <div className="space-y-2">
                {compatibleVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2 text-sm"
                  >
                    <span>
                      {vehicle.brand.name} {vehicle.model.name}
                    </span>
                    <span className="text-muted-foreground">
                      {vehicle.year} {vehicle.engine && `• ${vehicle.engine}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PartDetail;

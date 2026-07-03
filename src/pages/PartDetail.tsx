import { useState } from "react";
import { useParams, useNavigate, useLoaderData, Link, type LoaderFunctionArgs } from "react-router-dom";
import { ChevronLeft, Package, Check, Car, Send, MessageCircle, Phone } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { usePart } from "@/hooks/useQueries";
import { useLanguage } from "@/hooks/useLanguage";
import { getTelegramLink, getWhatsAppLink, getMaxLink } from "@/lib/contact-links";
import { sanityImage } from "@/lib/image";
import { getPartForBuild } from "@/lib/catalog-build";
import type { Part } from "@/types";

// Build-time loader: bakes each part's data into its pre-rendered HTML.
// On the client, vite-react-ssg serves this from the per-route manifest for
// pre-rendered parts; brand-new parts (not yet rebuilt) fall back to react-query.
export async function loader({ params }: LoaderFunctionArgs) {
  const part = await getPartForBuild(params.slug);
  return { part };
}

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
  "general": "general",
  "general-parts": "general",
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
  // Prefer build-time / manifest data; only hit react-query when it's absent.
  const loaderData = useLoaderData() as { part: Part | null } | null;
  const bakedPart = loaderData?.part ?? null;
  const { data: queryPart, isLoading: queryLoading } = usePart(bakedPart ? undefined : slug);
  const part = bakedPart ?? queryPart;
  const isLoading = bakedPart ? false : queryLoading;
  const [selectedImage, setSelectedImage] = useState(0);
  const { t } = useLanguage();

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
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Button onClick={() => navigate("/catalog")}>
              {t.common.browseCatalog}
            </Button>
            <Button variant="outline" onClick={() => navigate("/contact")}>
              {t.common.orderPart}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const partName = getPartName(part.slug, part.name);

  // Use compatible vehicles from Sanity or empty array
  const compatibleVehicles = part.compatibleVehicles || [];

  // Helper to get a right-sized WebP image URL from Sanity (or pass through local URLs)
  const getImageUrl = (
    img: string | { id: number; url: string; alt?: string },
    w = 800
  ) => {
    const url = typeof img === "string" ? img : img.url;
    return sanityImage(url, { w });
  };

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
          {part.images.length > 0 && part.images[0] !== "/placeholder.svg" && (
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg border border-border/50 bg-card">
                <img
                  src={getImageUrl(part.images[selectedImage], 800)}
                  alt={partName}
                  className="h-full w-full object-cover"
                  decoding="async"
                />
              </div>
              
              {part.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {part.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                        selectedImage === index ? "border-primary" : "border-border/50"
                      }`}
                    >
                      <img
                        src={getImageUrl(image, 160)}
                        alt={`${partName} ${index + 1}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Details */}
          <div className="space-y-6">
            <div>
              {part.category && (
                <p className="text-sm font-medium text-primary">{getCategoryName(part.category.slug)}</p>
              )}
              <h1
                className="mt-1 text-2xl font-bold leading-[1.25] tracking-normal md:text-3xl"
                style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
              >
                {partName}
              </h1>
            </div>

            {/* Article Numbers */}
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="text-xs text-muted-foreground">{t.common.articleNumber}</p>
                <p
                  className="text-sm font-semibold tabular-nums tracking-[0.01em]"
                  style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
                >
                  {part.articleNumber}
                </p>
              </div>
              {part.oemNumber && (
                <div>
                  <p className="text-xs text-muted-foreground">{t.common.oemNumber}</p>
                  <p
                    className="text-sm font-semibold tabular-nums tracking-[0.01em]"
                    style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
                  >
                    {part.oemNumber}
                  </p>
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
                <a
                  href={getTelegramLink({ name: part.name, articleNumber: part.articleNumber, oemNumber: part.oemNumber })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-[#0088cc] hover:bg-[#0088cc]/90 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Telegram
                </a>
                <a
                  href={getWhatsAppLink({ name: part.name, articleNumber: part.articleNumber, oemNumber: part.oemNumber })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-[#25D366] hover:bg-[#25D366]/90 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
                <a
                  href={getMaxLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-border bg-background hover:bg-secondary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  MAX
                </a>
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

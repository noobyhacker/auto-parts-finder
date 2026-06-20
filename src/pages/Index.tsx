import { memo, useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Truck, Headphones, CheckCircle2, ChevronDown } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SearchAutocomplete } from "@/components/search/SearchAutocomplete";
import { VideoReviewCarousel } from "@/components/video/VideoReviewCarousel";
import { KoreanFlagMini } from "@/components/icons/KoreanFlag";
import { useLanguage } from "@/hooks/useLanguage";
import { CursorGlow } from "@/components/CursorGlow";
import parentCompanyLogo from "@/assets/parent-company-logo.png";
import carsHero from "@/assets/cars-hero.png";
const businessRegistrationUrl = "/business-registration.png";

function useCountUpOnScroll(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let startTime: number | null = null;
        const step = (ts: number) => {
          if (!startTime) startTime = ts;
          const progress = Math.min((ts - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);
  return { count, ref };
}

const StatBlock = memo(({ value, numericValue, label, delay, suffix }: { value: string; numericValue?: number; label: string; delay: string; suffix?: string }) => {
  const { count, ref } = useCountUpOnScroll(numericValue ?? 0);
  const displayValue = numericValue !== undefined ? `${count}${suffix ?? ""}` : value;
  return (
    <div
      ref={ref}
      className="stat-block transition-all duration-500 animate-slide-up"
      style={{ animationDelay: delay }}
    >
      <div className="font-display text-3xl md:text-4xl font-extrabold text-primary tracking-tight">{displayValue}</div>
      <div className="mt-1 text-sm text-muted-foreground uppercase tracking-widest">{label}</div>
    </div>
  );
});
StatBlock.displayName = "StatBlock";

const FeatureRow = memo(({ Icon, title, desc, index }: { Icon: any; title: string; desc: string; index: number }) => (
  <div
    className={`group flex items-start gap-5 p-5 border-b border-border/50 last:border-0 transition-all duration-300 hover:bg-primary/5`}
  >
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary/10 group-hover:bg-primary/20 transition-colors">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <h3 className="font-display font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  </div>
));
FeatureRow.displayName = "FeatureRow";

const brands = [
  { name: "Hyundai", tagline: "Sonata • Tucson • Santa Fe • Palisade" },
  { name: "Kia", tagline: "K5 • Sportage • Sorento • Telluride" },
  { name: "Genesis", tagline: "G70 • G80 • G90 • GV70 • GV80" },
  { name: "SsangYong", tagline: "Rexton • Korando • Tivoli • Musso" },
];

const Index = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <CursorGlow />

      {/* ─── HERO ─── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 homepage-gradient" />
        <div className="absolute inset-0 animated-grid opacity-30" />
        
        {/* Decorative Korean text */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 korean-texture select-none" aria-hidden="true">
          자동차<br />부품
        </div>

        {/* Diagonal accent line */}
        <div className="diagonal-accent top-1/3" />
        <div className="diagonal-accent bottom-1/4" style={{ animationDelay: "0.5s" }} />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/6 w-60 h-60 bg-accent/15 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: "2s" }} />

        {/* Cars image — hero background, full width on mobile, right-half on desktop */}
        <div className="absolute bottom-0 left-0 right-0 md:left-auto md:right-0 md:w-[55%] pointer-events-none select-none" style={{ zIndex: 1 }}>
          <img
            src={carsHero}
            alt=""
            aria-hidden="true"
            className="w-full object-contain object-bottom opacity-30 md:opacity-95 dark:opacity-20 md:dark:opacity-75"
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, black 20%), linear-gradient(to top, black 50%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 20%), linear-gradient(to top, black 50%, transparent 100%)",
              maskComposite: "intersect",
              WebkitMaskComposite: "destination-in",
            }}
          />
        </div>

        {/* Floating decorative shapes */}
        <div className="absolute top-1/3 left-[8%] w-3 h-3 rounded-full bg-primary/40 animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute top-2/3 left-[15%] w-2 h-2 rounded-full bg-accent/50 animate-float-slow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/4 right-[20%] w-2.5 h-2.5 rounded-sm bg-primary/30 animate-float rotate-45" style={{ animationDelay: "0.8s" }} />
        <div className="absolute bottom-1/3 right-[10%] w-2 h-2 rounded-full bg-accent/40 animate-float-fast" style={{ animationDelay: "2.2s" }} />

        <div className="container-custom relative py-20 md:py-28" style={{ zIndex: 2 }}>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div className="max-w-xl">
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.9] tracking-tighter animate-slide-up" style={{ animationDelay: "0.1s" }}>
                {t.hero.title}
                <span className="block text-gradient mt-2">{t.hero.titleBrands}</span>
              </h1>
              
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-md animate-slide-up" style={{ animationDelay: "0.2s" }}>
                {t.hero.subtitle}
              </p>

              <div className="mt-8 flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <div className="relative">
                  <div className="pulse-ring" />
                  <Link
                    to="/catalog"
                    className="relative inline-flex items-center gap-2 px-7 py-3.5 rounded-sm bg-primary text-primary-foreground font-display font-semibold text-sm uppercase tracking-wider btn-glow hover:opacity-90 transition-opacity"
                  >
                    {t.nav.catalog}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-sm border border-border text-foreground font-display font-semibold text-sm uppercase tracking-wider hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  {t.nav.contact}
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: "0.45s" }}>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  <span>14+ лет на рынке</span>
                </div>
                <div className="w-px h-4 bg-border self-center" />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  <span>Гарантия качества</span>
                </div>
                <div className="w-px h-4 bg-border self-center" />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  <span>Доставка по России</span>
                </div>
              </div>
            </div>

            {/* Right — Cars image + Search card */}
            <div className="relative animate-slide-up" style={{ animationDelay: "0.35s" }}>
              {/* Floating badge — top-right */}
              <div className="trust-badge -top-4 -right-4 animate-float" style={{ animationDelay: "0.5s", zIndex: 2 }}>
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-muted-foreground">100K+ запчастей</span>
              </div>
              {/* Floating badge — bottom-left */}
              <div className="trust-badge -bottom-4 -left-4 animate-float-slow" style={{ animationDelay: "1.8s", zIndex: 2 }}>
                <Shield className="h-3.5 w-3.5 text-primary" />
                <span className="text-muted-foreground">Гарантия качества</span>
              </div>

              {/* Search card — above image */}
              <div className="relative glass-card p-6 md:p-8 border-primary/20" style={{ zIndex: 1 }}>
                <p className="mb-2 font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  {t.vehicle.searchByOEM}
                </p>
                <SearchAutocomplete
                  inputClassName="h-12 text-base"
                  navigateToCatalogOnEnter
                />
                <p className="mt-3 text-xs text-muted-foreground">{t.vehicle.oemHint}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/50 scroll-indicator animate-fade-in" style={{ animationDelay: "1.5s" }}>
          <span className="text-[10px] uppercase tracking-widest">Листать</span>
          <ChevronDown className="h-4 w-4" />
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="border-y border-border/50 relative">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4">
            <StatBlock value="14+" numericValue={14} suffix="+" label={t.about.stats.years} delay="0s" />
            <StatBlock value="100K+" numericValue={100} suffix="K+" label={t.about.stats.parts} delay="0.1s" />
            <StatBlock value="50K+" numericValue={50} suffix="K+" label={t.about.stats.customers} delay="0.2s" />
            <StatBlock value="24h" label={t.about.stats.dispatch} delay="0.3s" />
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 floating-particles" />

        <div className="container-custom relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left heading */}
            <div className="lg:sticky lg:top-28 reveal">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px w-8 bg-primary" />
                <span className="text-xs text-primary uppercase tracking-widest font-medium">{t.about.badge}</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
                {t.about.title}
                <span className="block text-gradient">{t.about.titleHighlight}</span>
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
                {t.about.description1}
              </p>
              <Link
                to="/about"
                className="mt-6 inline-flex items-center gap-2 text-primary font-display font-semibold text-sm uppercase tracking-wider hover:gap-3 transition-all"
              >
                {t.about.learnMore}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right feature list */}
            <div className="glass-card divide-y divide-border/50 reveal reveal-d2">
              <FeatureRow Icon={Truck} title={t.features.shipping} desc={t.features.shippingDesc} index={0} />
              <FeatureRow Icon={Shield} title={t.features.quality} desc={t.features.qualityDesc} index={1} />
              <FeatureRow Icon={Headphones} title={t.features.support} desc={t.features.supportDesc} index={2} />
              <FeatureRow Icon={Zap} title={t.features.catalog} desc={t.features.catalogDesc} index={3} />
            </div>
          </div>
        </div>
      </section>

      {/* Parent company section */}
      <section className="py-20 md:py-28 border-t border-border/50 relative overflow-hidden">
        <div className="container-custom relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            <div className="glass-card p-6 md:p-8 reveal">
              <img
                src={parentCompanyLogo}
                alt="Parent company logo"
                className="h-10 md:h-12 w-auto mb-5"
                loading="lazy"
              />
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px w-8 bg-primary" />
                <span className="text-xs text-primary uppercase tracking-widest font-medium">{t.parentCompany.badge}</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold leading-tight">
                {t.parentCompany.title}
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {t.parentCompany.description}
              </p>

              <div className="mt-6 space-y-3 text-sm">
                <p>
                  <span className="text-muted-foreground">{t.parentCompany.phoneLabel}:</span>{" "}
                  <a href="tel:+74162771307" className="text-primary hover:underline">+7 (4162) 77-13-07</a>
                </p>
                <p>
                  <span className="text-muted-foreground">{t.parentCompany.mobileLabel}:</span>{" "}
                  <a href="tel:+79145505217" className="text-primary hover:underline">+7 (914) 550-52-17</a>
                </p>
                <p>
                  <span className="text-muted-foreground">{t.parentCompany.emailLabel}:</span>{" "}
                  <a href="mailto:rerekin@mail.ru" className="text-primary hover:underline">rerekin@mail.ru</a>
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t.parentCompany.addressLine1}<br />
                  {t.parentCompany.addressLine2}
                </p>
              </div>
            </div>

            <div className="glass-card p-3 md:p-4 reveal reveal-d2">
              <iframe
                src="https://www.google.com/maps/embed?pb=!3m2!1sen!2skr!4v1779360548237!5m2!1sen!2skr!6m8!1m7!1sucvYKoQfns_arrgblrX7tg!2m2!1d50.30469138127859!2d127.5330426583126!3f295.4845197453312!4f-7.937552665948502!5f0.7820865974627469"
                className="w-full h-[320px] md:h-full min-h-[320px] rounded-sm"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t.parentCompany.mapTitle}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Business Registration */}
      <section className="py-20 md:py-28 border-t border-border/50 relative">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-2 reveal">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px w-8 bg-primary" />
                <span className="text-xs text-primary uppercase tracking-widest font-medium">{t.businessReg.badge}</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold leading-tight">
                {t.businessReg.title}
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {t.businessReg.description}
              </p>
            </div>
            <div className="lg:col-span-3 reveal reveal-d2">
              <a
                href={businessRegistrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block glass-card p-3 md:p-4"
              >
                <img
                  src={businessRegistrationUrl}
                  alt={t.businessReg.alt}
                  className="w-full h-auto rounded-sm"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* ─── BRANDS ─── */}
      <section className="py-20 md:py-28 border-t border-border/50 relative">
        <div className="container-custom">
          <div className="flex items-center gap-2 mb-4">
            <KoreanFlagMini className="h-3.5 w-5" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest">{t.brands.badge}</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-4">{t.brands.title}</h2>
          <p className="text-muted-foreground mb-12 max-w-lg">{t.brands.subtitle}</p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brands.map((brand, i) => (
              <div
                key={brand.name}
                className={`group glass-card p-6 reveal reveal-d${Math.min(i + 1, 6)}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <KoreanFlagMini className="h-3 w-4.5 opacity-40 group-hover:opacity-80 transition-opacity" />
                  <h3 className="font-display text-xl font-extrabold text-primary tracking-tight">{brand.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground tracking-wide">{brand.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VIDEO REVIEWS ─── */}
      <VideoReviewCarousel />

      {/* ─── CTA ─── */}
      <section className="py-20 md:py-28 border-t border-border/50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/8 via-transparent to-transparent" />
          <div className="absolute inset-0 animated-grid opacity-15" />
        </div>
        
        <div className="container-custom relative text-center">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold">{t.cta.title}</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">{t.cta.subtitle}</p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-sm border border-border font-display font-semibold text-sm uppercase tracking-wider hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              {t.cta.aboutUs}
            </Link>
            <Link
              to="/faq"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-sm border border-border font-display font-semibold text-sm uppercase tracking-wider hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              {t.cta.faq}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-sm bg-primary text-primary-foreground font-display font-semibold text-sm uppercase tracking-wider btn-glow hover:opacity-90 transition-opacity"
            >
              {t.cta.contactUs}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

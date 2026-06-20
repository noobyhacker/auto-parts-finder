import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Award, Users, Clock, MapPin, Target, Heart, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { KoreanFlagMini } from "@/components/icons/KoreanFlag";

function useCountUpOnScroll(target: number, duration = 1600) {
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

function StatItem({ numeric, suffix, label, delay }: { numeric: number; suffix: string; label: string; delay: number }) {
  const { count, ref } = useCountUpOnScroll(numeric);
  return (
    <div
      ref={ref}
      className="stat-block py-7 text-center animate-slide-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="font-display text-3xl font-extrabold text-primary">{count}{suffix}</div>
      <div className="mt-1 text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  );
}

const milestones = [
  { year: "2010", key: "founded" },
  { year: "2014", key: "expanded" },
  { year: "2018", key: "online" },
  { year: "2024", key: "today" },
] as const;

const About = () => {
  const { t } = useLanguage();

  const values = [
    { Icon: Award,   title: t.aboutPage.qualityFirst,    desc: t.aboutPage.qualityFirstDesc },
    { Icon: Users,   title: t.aboutPage.customerFocus,   desc: t.aboutPage.customerFocusDesc },
    { Icon: Clock,   title: t.aboutPage.fastDelivery,    desc: t.aboutPage.fastDeliveryDesc },
    { Icon: Target,  title: t.aboutPage.expertise,       desc: t.aboutPage.expertiseDesc },
    { Icon: Heart,   title: t.aboutPage.trust,           desc: t.aboutPage.trustDesc },
    { Icon: MapPin,  title: t.aboutPage.localPresence,   desc: t.aboutPage.localPresenceDesc },
  ];

  const statsConfig = [
    { value: "14+", numeric: 14, suffix: "+", label: t.about.stats.years },
    { value: "100K+", numeric: 100, suffix: "K+", label: t.about.stats.parts },
    { value: "50K+", numeric: 50, suffix: "K+", label: t.about.stats.customers },
    { value: "99%", numeric: 99, suffix: "%", label: t.aboutPage.satisfaction },
  ];

  const advantages = [
    t.features.shipping, t.features.quality, t.features.support, t.features.catalog,
  ];

  return (
    <Layout>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 homepage-gradient" />
        <div className="absolute inset-0 animated-grid opacity-20" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 korean-texture select-none pointer-events-none" aria-hidden>
          우리
        </div>

        <div className="container-custom relative py-14 md:py-20">
          <div className="max-w-2xl animate-slide-up">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-primary" />
              <KoreanFlagMini className="h-3.5 w-5" />
              <span className="text-xs text-primary uppercase tracking-widest font-semibold">{t.about.badge}</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight">
              {t.aboutPage.title}{" "}
              <span className="text-gradient">{t.aboutPage.titleHighlight}</span>
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">{t.aboutPage.subtitle}</p>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="border-b border-border/40 bg-card/30">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {statsConfig.map((s, i) => (
              <StatItem key={i} numeric={s.numeric} suffix={s.suffix} label={s.label} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="py-14 md:py-20">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            {/* Text */}
            <div className="reveal">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px w-8 bg-accent" />
                <span className="text-xs text-accent uppercase tracking-widest font-semibold">{t.aboutPage.storyTitle}</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">{t.aboutPage.storyTitle}</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{t.aboutPage.storyP1}</p>
                <p>{t.aboutPage.storyP2}</p>
                <p>{t.aboutPage.storyP3}</p>
              </div>

              {/* Advantages list */}
              <ul className="mt-8 space-y-3">
                {advantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Timeline */}
            <div className="relative pl-6 reveal reveal-d2">
              <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent" />
              <div className="space-y-8">
                {milestones.map((m, i) => (
                  <div
                    key={m.year}
                    className="relative"
                  >
                    <div className="absolute -left-[25px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-background">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                    <div className="glass-card p-5">
                      <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{m.year}</div>
                      <p className="text-sm text-muted-foreground">
                        {t.aboutPage.storyP1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="border-t border-border/40 py-14 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 floating-particles" />
        <div className="container-custom relative">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px w-8 bg-primary" />
              <span className="text-xs text-primary uppercase tracking-widest font-semibold">{t.aboutPage.valuesTitle}</span>
              <div className="h-px w-8 bg-primary" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">{t.aboutPage.valuesTitle}</h2>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">{t.aboutPage.valuesSubtitle}</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map(({ Icon, title, desc }, i) => (
              <div
                key={i}
                className={`glass-card p-6 group reveal reveal-d${Math.min(i + 1, 6)}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-sm mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border/40 py-14 md:py-20">
        <div className="container-custom">
          <div className="glass-card p-8 md:p-12 text-center max-w-2xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold">{t.aboutPage.ctaTitle}</h2>
            <p className="mt-2 text-muted-foreground">{t.aboutPage.ctaSubtitle}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold btn-glow hover:opacity-90 transition-opacity"
              >
                {t.aboutPage.browseCatalog}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border bg-secondary text-foreground font-semibold hover:bg-secondary/80 transition-colors"
              >
                {t.cta.contactUs}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;

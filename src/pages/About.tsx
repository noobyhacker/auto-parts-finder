import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Award, Users, Clock, MapPin, Target, Heart } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { KoreanFlagMini } from "@/components/icons/KoreanFlag";

const About = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 animated-grid opacity-20" />
        
        <div className="container-custom relative py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <KoreanFlagMini className="h-5 w-8 rounded shadow-sm" />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl animate-slide-up">
              {t.aboutPage.title} <span className="text-gradient">{t.aboutPage.titleHighlight}</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
              {t.aboutPage.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="animate-fade-in">
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                {t.aboutPage.storyTitle}
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground">
                <p>{t.aboutPage.storyP1}</p>
                <p>{t.aboutPage.storyP2}</p>
                <p>{t.aboutPage.storyP3}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-6 text-center animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <div className="text-3xl font-display font-bold text-primary">14+</div>
                <div className="mt-1 text-sm text-muted-foreground">{t.about.stats.years}</div>
              </div>
              <div className="glass-card p-6 text-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <div className="text-3xl font-display font-bold text-primary">100K+</div>
                <div className="mt-1 text-sm text-muted-foreground">{t.about.stats.parts}</div>
              </div>
              <div className="glass-card p-6 text-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <div className="text-3xl font-display font-bold text-primary">50K+</div>
                <div className="mt-1 text-sm text-muted-foreground">{t.about.stats.customers}</div>
              </div>
              <div className="glass-card p-6 text-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
                <div className="text-3xl font-display font-bold text-primary">99%</div>
                <div className="mt-1 text-sm text-muted-foreground">{t.aboutPage.satisfaction}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="border-t border-border/50 py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 floating-particles" />
        
        <div className="container-custom relative">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-bold md:text-3xl">{t.aboutPage.valuesTitle}</h2>
            <p className="mt-2 text-muted-foreground">{t.aboutPage.valuesSubtitle}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display font-semibold">{t.aboutPage.qualityFirst}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.aboutPage.qualityFirstDesc}</p>
            </div>

            <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display font-semibold">{t.aboutPage.customerFocus}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.aboutPage.customerFocusDesc}</p>
            </div>

            <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display font-semibold">{t.aboutPage.fastDelivery}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.aboutPage.fastDeliveryDesc}</p>
            </div>

            <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display font-semibold">{t.aboutPage.expertise}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.aboutPage.expertiseDesc}</p>
            </div>

            <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display font-semibold">{t.aboutPage.trust}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.aboutPage.trustDesc}</p>
            </div>

            <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display font-semibold">{t.aboutPage.localPresence}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.aboutPage.localPresenceDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50 py-16 md:py-20">
        <div className="container-custom text-center">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            {t.aboutPage.ctaTitle}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t.aboutPage.ctaSubtitle}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/catalog"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium btn-glow hover:opacity-90 transition-opacity"
            >
              {t.aboutPage.browseCatalog}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
            >
              {t.cta.contactUs}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;

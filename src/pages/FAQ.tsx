import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle, ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const FAQ = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 homepage-gradient" />
        <div className="absolute inset-0 animated-grid opacity-20" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 korean-texture select-none pointer-events-none" aria-hidden>
          질문
        </div>

        <div className="container-custom relative py-14 md:py-20">
          <div className="max-w-2xl animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-8 bg-primary" />
              <span className="text-xs text-primary uppercase tracking-widest font-semibold">FAQ</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight">
              {t.faqPage.title}{" "}
              <span className="text-gradient">{t.faqPage.titleHighlight}</span>
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">{t.faqPage.subtitle}</p>
          </div>
        </div>
      </section>

      {/* ── FAQ LIST ── */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl reveal">
            <Accordion type="single" collapsible className="space-y-3">
              {t.faqPage.questions.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="glass-card overflow-hidden data-[state=open]:border-primary/50"
                >
                  <AccordionTrigger className="px-6 py-5 text-left font-semibold hover:text-primary transition-colors hover:no-underline group">
                    <div className="flex items-start gap-4 text-left">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary mt-0.5 group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-colors">
                        {index + 1}
                      </span>
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5">
                    <div className="pl-10 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border/40 py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 floating-particles" />
        <div className="container-custom relative">
          <div className="mx-auto max-w-2xl">
            <div className="glass-card p-8 md:p-12 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <MessageCircle className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">
                {t.faqPage.stillQuestions}
              </h2>
              <p className="mt-2 text-muted-foreground">{t.faqPage.stillQuestionsDesc}</p>
              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold btn-glow hover:opacity-90 transition-opacity"
              >
                {t.faqPage.contactSupport}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;

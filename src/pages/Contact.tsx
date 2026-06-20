import { MessageCircle, Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { getTelegramLink, getWhatsAppLink, getMaxLink } from "@/lib/contact-links";

const Contact = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 homepage-gradient" />
        <div className="absolute inset-0 animated-grid opacity-20" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 korean-texture select-none pointer-events-none" aria-hidden>
          연락
        </div>

        <div className="container-custom relative py-14 md:py-20">
          <div className="max-w-xl animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-8 bg-primary" />
              <span className="text-xs text-primary uppercase tracking-widest font-semibold">
                {t.nav.contact}
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight">
              {t.contactPage.title}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              {t.contactPage.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTACT GRID ── */}
      <section className="container-custom py-12 md:py-16">
        <div className="grid gap-6 lg:grid-cols-3">

          {/* ── LEFT: Info cards ── */}
          <div className="space-y-4 reveal">
            {/* Phone */}
            <div className="glass-card p-6 group">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">{t.contactPage.phone}</p>
                  <a href="tel:+74162771307" className="block text-sm font-medium hover:text-primary transition-colors">
                    +7 (4162) 77-13-07
                  </a>
                  <a href="tel:+79145505217" className="block text-sm font-medium hover:text-primary transition-colors mt-0.5">
                    +7 (914) 550-52-17
                  </a>
                  <p className="mt-2 text-xs text-muted-foreground">{t.contactPage.phoneHours}</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="glass-card p-6 group">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">{t.contactPage.email}</p>
                  <a href="mailto:rerekin@mail.ru" className="block text-sm font-medium hover:text-primary transition-colors">
                    rerekin@mail.ru
                  </a>
                  <p className="mt-2 text-xs text-muted-foreground">{t.contactPage.emailReply}</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="glass-card p-6 group">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">{t.contactPage.address}</p>
                  <p className="text-sm font-medium leading-relaxed">
                    서울특별시 동대문구 황물로 17가길 2,<br />
                    1층, 4호
                  </p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="glass-card p-6 group">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">{t.contactPage.phoneHours}</p>
                  <p className="text-sm font-medium">Пн–Пт: 9:00 – 18:00</p>
                  <p className="text-sm text-muted-foreground">Сб–Вс: выходной</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Messengers ── */}
          <div className="lg:col-span-2 reveal reveal-d2">
            <div className="glass-card p-8 md:p-10 h-full flex flex-col">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-px w-6 bg-primary" />
                <span className="text-xs text-primary uppercase tracking-widest font-semibold">
                  {t.contactPage.messageUs}
                </span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mt-1">
                {t.contactPage.chooseMessenger}
              </h2>
              <p className="mt-2 text-muted-foreground text-sm max-w-md">
                Выберите удобный мессенджер. Мы ответим в течение нескольких минут.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3 flex-1 content-start">
                {/* Telegram */}
                <a
                  href={getTelegramLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col items-center gap-3 rounded-xl border border-border p-6 text-center hover:border-[#0088cc]/60 hover:shadow-lg hover:-translate-y-1 animate-scale-in"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--card)), hsl(var(--card)))",
                    animationDelay: "0.1s",
                    transition: "box-shadow 0.45s cubic-bezier(0.23, 1, 0.32, 1), transform 0.45s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.45s ease",
                  }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0088cc]/10 group-hover:bg-[#0088cc]/20 transition-colors duration-[450ms]">
                    <svg className="h-7 w-7 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm">Telegram</p>
                    <p className="text-xs text-muted-foreground mt-0.5">@magazinamur</p>
                  </div>
                  <ArrowRight className="absolute right-3 top-3 h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-[450ms]" />
                </a>

                {/* WhatsApp */}
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col items-center gap-3 rounded-xl border border-border p-6 text-center hover:border-[#25D366]/60 hover:shadow-lg hover:-translate-y-1 animate-scale-in"
                  style={{
                    animationDelay: "0.2s",
                    transition: "box-shadow 0.45s cubic-bezier(0.23, 1, 0.32, 1), transform 0.45s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.45s ease",
                  }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366]/10 group-hover:bg-[#25D366]/20 transition-colors duration-[450ms]">
                    <svg className="h-7 w-7 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm">WhatsApp</p>
                    <p className="text-xs text-muted-foreground mt-0.5">+7 (914) 550-52-17</p>
                  </div>
                  <ArrowRight className="absolute right-3 top-3 h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-[450ms]" />
                </a>

                {/* MAX */}
                <a
                  href={getMaxLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col items-center gap-3 rounded-xl border border-border p-6 text-center"
                  style={{
                    transition: "box-shadow 0.45s cubic-bezier(0.23, 1, 0.32, 1), transform 0.45s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.45s ease",
                  }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#168acd]/10 group-hover:bg-[#168acd]/20 transition-colors duration-[450ms]">
                    <MessageCircle className="h-7 w-7 text-[#168acd]" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm">MAX</p>
                    <p className="text-xs text-muted-foreground mt-0.5">ВКонтакте MAX</p>
                  </div>
                  <ArrowRight className="absolute right-3 top-3 h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-[450ms]" />
                </a>
              </div>

              {/* Map */}
              <div className="mt-8 rounded-xl overflow-hidden border border-border/50">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.546492248888!2d127.05721007612016!3d37.565747224173016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbb4ae9691f4d%3A0xbd12205af5ca42c!2s2%20Hwangmul-ro%2017ga-gil%2C%20Dongdaemun%20District%2C%20Seoul!5e0!3m2!1sen!2skr!4v1781986849970!5m2!1sen!2skr"
                  className="w-full h-52"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="AmurKor location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;

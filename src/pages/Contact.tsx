import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getPart } from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";
import { z } from "zod";

const Contact = () => {
  const [searchParams] = useSearchParams();
  const partSlug = searchParams.get("part");
  const { t } = useLanguage();

  const contactSchema = z.object({
    name: z.string().trim().min(1, t.contactPage.formName + " is required").max(100),
    contact: z.string().trim().min(1, t.contactPage.formContact + " is required").max(255),
    message: z.string().trim().min(1, t.contactPage.formMessage + " is required").max(2000),
  });

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-fill part info
  useEffect(() => {
    if (partSlug) {
      getPart(partSlug).then((part) => {
        if (part) {
          setFormData((prev) => ({
            ...prev,
            message: `${t.contactPage.partInquiry}\n\n${part.name}\nArticle: ${part.articleNumber}\n${t.common.price}: $${part.price.toFixed(2)}\n\n${t.contactPage.availabilityRequest}`,
          }));
        }
      });
    }
  }, [partSlug, t]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="container-custom flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold">{t.contactPage.successTitle}</h1>
          <p className="mt-2 max-w-md text-muted-foreground">
            {t.contactPage.successMessage}
          </p>
          <Button className="mt-6" onClick={() => setIsSuccess(false)}>
            {t.common.sendAnother}
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-8 md:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold md:text-4xl">{t.contactPage.title}</h1>
            <p className="mt-2 text-muted-foreground">
              {t.contactPage.subtitle}
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t.contactPage.phone}</h3>
                    <a
                      href="tel:+1234567890"
                      className="mt-1 block text-sm text-muted-foreground hover:text-primary"
                    >
                      +1 (234) 567-890
                    </a>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t.contactPage.phoneHours}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t.contactPage.email}</h3>
                    <a
                      href="mailto:info@amurkor.ru"
                      className="mt-1 block text-sm text-muted-foreground hover:text-primary"
                    >
                      info@amurkor.ru
                    </a>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t.contactPage.emailReply}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t.contactPage.address}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      123 Auto Street<br />
                      Motor City, MC 12345
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8">
                <div className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t.contactPage.formName} *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t.contactPage.formNamePlaceholder}
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact">{t.contactPage.formContact} *</Label>
                      <Input
                        id="contact"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder={t.contactPage.formContactPlaceholder}
                        className={errors.contact ? "border-destructive" : ""}
                      />
                      {errors.contact && (
                        <p className="text-xs text-destructive">{errors.contact}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t.contactPage.formMessage} *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t.contactPage.formMessagePlaceholder}
                      rows={6}
                      className={errors.message ? "border-destructive" : ""}
                    />
                    {errors.message && (
                      <p className="text-xs text-destructive">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full gap-2 btn-glow"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      t.common.sending
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {t.common.sendMessage}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;

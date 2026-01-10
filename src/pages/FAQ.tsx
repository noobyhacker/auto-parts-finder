import { Layout } from "@/components/layout/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircle } from "lucide-react";

const faqs = [
  {
    question: "What brands do you carry parts for?",
    answer: "We specialize exclusively in Korean vehicle brands: Hyundai, Kia, Genesis, and SsangYong. Our focus allows us to maintain deep expertise and extensive inventory for these manufacturers.",
  },
  {
    question: "Are your parts OEM or aftermarket?",
    answer: "We offer both OEM (Original Equipment Manufacturer) and high-quality aftermarket parts. Each product listing clearly indicates whether it's an OEM or aftermarket part, allowing you to choose based on your needs and budget.",
  },
  {
    question: "How do I know if a part fits my vehicle?",
    answer: "Use our vehicle selector or VIN search feature to find parts compatible with your specific vehicle. Each part listing shows compatible vehicles. If you're unsure, contact our team with your VIN and we'll verify compatibility.",
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns within 30 days of purchase for unused parts in original packaging. Electrical components and special-order items may have different terms. Contact us for return authorization before shipping.",
  },
  {
    question: "How long does shipping take?",
    answer: "Orders placed before 2 PM are dispatched same-day. Standard delivery takes 2-5 business days depending on location. Express shipping options are available at checkout for urgent orders.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to many countries worldwide. International shipping rates and delivery times vary by destination. Contact us for a quote on international orders.",
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you'll receive an email with tracking information. You can use the tracking number on the carrier's website to monitor your delivery status.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept major credit cards (Visa, Mastercard, American Express), bank transfers, and cash for in-store purchases. All online transactions are secured with SSL encryption.",
  },
  {
    question: "Do you offer warranty on parts?",
    answer: "Yes, all our parts come with manufacturer warranty. OEM parts typically have 12-24 month warranty, while aftermarket parts vary by manufacturer. Warranty details are listed on each product page.",
  },
  {
    question: "Can I visit your physical location?",
    answer: "Absolutely! Our warehouse and showroom is open Monday to Saturday. You can browse parts, get expert advice, and pick up orders in person. See our Contact page for address and hours.",
  },
  {
    question: "What if I need a part you don't have in stock?",
    answer: "We can special-order most parts directly from manufacturers. Special orders typically take 5-10 business days. Contact us with your part number or vehicle details for availability and pricing.",
  },
  {
    question: "Do you offer bulk or wholesale pricing?",
    answer: "Yes, we offer competitive pricing for repair shops, mechanics, and bulk buyers. Contact our sales team to set up a wholesale account and discuss volume discounts.",
  },
];

const FAQ = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 animated-grid opacity-20" />
        
        <div className="container-custom relative py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 animate-pulse-glow">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl animate-slide-up">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Find answers to common questions about our parts and services
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="glass-card px-6 border border-border/50 rounded-lg data-[state=open]:border-primary/50 transition-colors"
                >
                  <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="border-t border-border/50 py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 floating-particles" />
        
        <div className="container-custom relative">
          <div className="mx-auto max-w-2xl glass-card p-8 md:p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <MessageCircle className="h-7 w-7 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Still have questions?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Can't find what you're looking for? Our team is here to help.
            </p>
            <a
              href="/contact"
              className="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium btn-glow hover:opacity-90 transition-opacity"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;

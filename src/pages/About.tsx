import { Layout } from "@/components/layout/Layout";
import { Award, Users, Clock, MapPin, Target, Heart } from "lucide-react";

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 animated-grid opacity-20" />
        
        <div className="container-custom relative py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl animate-slide-up">
              About <span className="text-gradient">KoreanAutoParts</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Your trusted partner for quality Korean vehicle parts since 2010
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
                Our Story
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground">
                <p>
                  Founded in 2010, KoreanAutoParts started with a simple mission: to provide 
                  high-quality, genuine parts for Korean vehicles at competitive prices.
                </p>
                <p>
                  What began as a small family operation has grown into one of the leading 
                  suppliers of Hyundai, Kia, Genesis, and SsangYong parts in the region. 
                  Our deep expertise in Korean automotive engineering sets us apart.
                </p>
                <p>
                  We work directly with OEM manufacturers and certified suppliers to ensure 
                  every part meets the highest standards of quality and reliability.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-6 text-center animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <div className="text-3xl font-display font-bold text-primary">14+</div>
                <div className="mt-1 text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="glass-card p-6 text-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <div className="text-3xl font-display font-bold text-primary">100K+</div>
                <div className="mt-1 text-sm text-muted-foreground">Parts in Stock</div>
              </div>
              <div className="glass-card p-6 text-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <div className="text-3xl font-display font-bold text-primary">50K+</div>
                <div className="mt-1 text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="glass-card p-6 text-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
                <div className="text-3xl font-display font-bold text-primary">99%</div>
                <div className="mt-1 text-sm text-muted-foreground">Satisfaction Rate</div>
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
            <h2 className="font-display text-2xl font-bold md:text-3xl">Our Values</h2>
            <p className="mt-2 text-muted-foreground">What drives us every day</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display font-semibold">Quality First</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We never compromise on quality. Every part is inspected and verified 
                before reaching our customers.
              </p>
            </div>

            <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display font-semibold">Customer Focus</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your satisfaction is our priority. Our team is always ready to help 
                you find the right parts.
              </p>
            </div>

            <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display font-semibold">Fast Delivery</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Same-day dispatch on orders placed before 2 PM. We know you need 
                your parts quickly.
              </p>
            </div>

            <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display font-semibold">Expertise</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Our specialists have deep knowledge of Korean vehicles and can 
                assist with any technical questions.
              </p>
            </div>

            <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display font-semibold">Trust</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Built on years of honest dealings and genuine parts. We stand 
                behind everything we sell.
              </p>
            </div>

            <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-display font-semibold">Local Presence</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                A physical location you can visit, with a team that understands 
                your local needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50 py-16 md:py-20">
        <div className="container-custom text-center">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            Ready to find your parts?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Browse our extensive catalog or contact us for assistance
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/catalog"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium btn-glow hover:opacity-90 transition-opacity"
            >
              Browse Catalog
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;

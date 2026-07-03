import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import type { RouteRecord } from "vite-react-ssg";
import { LanguageProvider } from "@/hooks/useLanguage";
import { ThemeProvider } from "@/hooks/useTheme";
import Lenis from "lenis";

// Eager-load the homepage so it's part of the initial pre-rendered document.
import Index from "./pages/Index";
import { getPartStaticPaths } from "@/lib/catalog-build";

/**
 * Root layout: all app-wide providers + global smooth-scroll / scroll-reveal.
 * Rendered once and wraps every route via <Outlet/>. The effects below run only
 * in the browser (inside useEffect), so they're safe during SSG pre-render.
 */
function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 15 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    // Hydration succeeded — cancel the index.html failsafe; the observer below
    // now drives scroll reveals. (If we're here, JS works.)
    if (typeof window !== "undefined" && (window as unknown as { __revealFailsafe?: number }).__revealFailsafe) {
      clearTimeout((window as unknown as { __revealFailsafe?: number }).__revealFailsafe);
    }

    // Global scroll-reveal: observe .reveal elements, add .is-visible when in view.
    // Set up BEFORE smooth-scroll so a Lenis failure can never leave content hidden.
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );

    const mutationObserver = new MutationObserver(() => {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
        revealObserver.observe(el);
      });
    });

    function observeAll() {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
        revealObserver.observe(el);
      });
    }
    observeAll();
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Smooth scroll — enhancement only; guarded so a failure can't break reveals.
    let lenis: Lenis | null = null;
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      const raf = (time: number) => {
        lenis?.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    } catch {
      lenis = null;
    }

    return () => {
      lenis?.destroy();
      revealObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Outlet />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Retry a dynamic import a few times before giving up — a dropped chunk request
// on a throttled link shouldn't leave the user on a blank route.
function retryImport<T>(fn: () => Promise<T>, attempts = 3, delay = 400): Promise<T> {
  return fn().catch((err) => {
    if (attempts <= 1) throw err;
    return new Promise<void>((r) => setTimeout(r, delay)).then(() =>
      retryImport(fn, attempts - 1, delay * 2)
    );
  });
}

// Adapter: our page modules export a default component (+ optional `loader`).
// React Router's `lazy` wants named { Component, loader }, so map them here.
const page =
  (importer: () => Promise<{ default: React.ComponentType; loader?: unknown }>) =>
  async () => {
    const mod = await retryImport(importer);
    return { Component: mod.default, loader: mod.loader as never };
  };

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <RootLayout />,
    entry: "src/App.tsx",
    children: [
      { index: true, element: <Index /> },
      { path: "catalog", lazy: page(() => import("./pages/Catalog")) },
      {
        path: "part/:slug",
        lazy: page(() => import("./pages/PartDetail")),
        getStaticPaths: getPartStaticPaths,
      },
      { path: "contact", lazy: page(() => import("./pages/Contact")) },
      { path: "about", lazy: page(() => import("./pages/About")) },
      { path: "faq", lazy: page(() => import("./pages/FAQ")) },
      { path: "*", lazy: page(() => import("./pages/NotFound")) },
    ],
  },
];

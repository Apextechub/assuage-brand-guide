import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ButtonLink } from "@/components/site/Button";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Logo } from "@/components/site/Logo";
import { site } from "@/data/site";

// Display font is preloaded; body font loads normally. Never @import font
// URLs in styles.css — Lightning CSS resolves imports from the filesystem.
const NEWSREADER_URL =
  "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap";
const INTER_TIGHT_URL =
  "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&display=swap";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 pb-24 pt-32 text-center">
      <Logo tone="navy" className="h-16" />
      <p className="micro-label mt-12 text-gold-deep">Error 404</p>
      <h1 className="display-1 mt-4 text-ink">Page not found</h1>
      <p className="measure mt-5 text-ink-soft">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-10">
        <ButtonLink to="/">Return home</ButtonLink>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 pb-24 pt-32 text-center">
      <Logo tone="navy" className="h-16" />
      <h1 className="display-2 mt-12 text-ink">This page didn't load</h1>
      <p className="measure mt-5 text-ink-soft">
        Something went wrong on our end. You can try refreshing or head back home.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <ButtonLink
          to="/"
          variant="outline"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Try again
        </ButtonLink>
        <ButtonLink to="/">Go home</ButtonLink>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Assuage Attorneys — Commercial Law Firm in Lagos" },
      { name: "description", content: site.description },
      { name: "author", content: site.name },
      { property: "og:title", content: "Assuage Attorneys — Commercial Law Firm in Lagos" },
      { property: "og:description", content: site.description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: site.name },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preload", as: "style", href: NEWSREADER_URL },
      { rel: "stylesheet", href: NEWSREADER_URL },
      { rel: "stylesheet", href: INTER_TIGHT_URL },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </QueryClientProvider>
  );
}

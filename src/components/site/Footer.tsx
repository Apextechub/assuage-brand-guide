import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Music2, Twitter } from "lucide-react";
import { site } from "@/data/site";
import { practiceAreas } from "@/data/practiceAreas";
import { Logo } from "./Logo";

// Lucide has no TikTok glyph; Music2 is the conventional stand-in.
const socialIcons: Record<string, typeof Linkedin> = {
  LinkedIn: Linkedin,
  X: Twitter,
  Instagram: Instagram,
  Facebook: Facebook,
  TikTok: Music2,
};

export function Footer() {
  return (
    <footer className="on-dark bg-ink text-paper">
      <div className="mx-auto w-full max-w-[76rem] px-5 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo tone="white" className="h-16" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-paper/60">
              {site.description}
            </p>
          </div>

          <nav className="md:col-span-2" aria-label="Practice areas">
            <h2 className="micro-label text-gold">Practice areas</h2>
            <ul className="mt-5 space-y-2.5">
              {practiceAreas.map((area) => (
                <li key={area.slug}>
                  <Link
                    to="/practice-areas/$slug"
                    params={{ slug: area.slug }}
                    className="text-sm text-paper/60 transition-colors duration-200 hover:text-paper"
                  >
                    {area.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="micro-label text-gold">Offices</h2>
            <div className="mt-5 space-y-6">
              {site.offices.map((office) => (
                <address key={office.name} className="not-italic">
                  <p className="text-sm font-medium text-paper">{office.name}</p>
                  {office.lines.map((line) => (
                    <p key={line} className="text-sm leading-relaxed text-paper/60">
                      {line}
                    </p>
                  ))}
                </address>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h2 className="micro-label text-gold">Contact</h2>
            <p className="mt-5 text-sm">
              <a
                href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                className="text-paper/60 transition-colors duration-200 hover:text-paper"
              >
                {site.phone}
              </a>
            </p>
            <p className="mt-2 text-sm">
              <a
                href={`mailto:${site.email}`}
                className="text-paper/60 underline decoration-paper/20 underline-offset-4 transition-colors duration-200 hover:text-gold hover:decoration-gold"
              >
                {site.email}
              </a>
            </p>
            <div className="mt-6 flex gap-3">
              {site.social.map((item) => {
                const Icon = socialIcons[item.label] ?? Linkedin;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`Assuage Attorneys on ${item.label}`}
                    className="flex size-10 items-center justify-center border border-paper/15 text-paper/70 transition-colors duration-200 hover:border-gold hover:text-gold"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-paper/10 pt-6 text-xs text-paper/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="transition-colors duration-200 hover:text-paper">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition-colors duration-200 hover:text-paper">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

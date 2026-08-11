# Assuage Brand Launch

Design a marketing UI website for Assuage Attorneys, a Nigerian commercial law firm based in Lagos.

## Who this is for

The audience is general counsel, founders, finance directors and international firms looking for Nigerian counsel. They are risk-averse, skim-read, and judge credibility in about four seconds. The site's single job is to make a serious buyer believe this firm can handle their matter, and then get them to a consultation request.

Reference for structure and information architecture only, NOT for visual style: alliancelawfirm.ng. Match that level of depth and professionalism, but the design must be visually original. Do not copy their layout, colours, imagery or copy.

## Design direction

Restrained editorial authority. Think a well-set legal journal, not a SaaS landing page. Confident whitespace, hairline rules, precise typography, almost no rounded corners, no gradients, no glassmorphism, no floating 3D shapes, no gradient-heavy tech palette, no emoji, no stock-photo handshakes or gavels.

Define every colour and font as CSS custom properties in index.css and map them into the Tailwind theme, so the whole palette can be adjusted in one place later.

Palette (these are the client's actual brand colours, taken from their logo and social identity, token-driven):

--navy: #000072        /* brand navy: header, footer, dark bands, primary buttons */

--navy-deep: #00004E   /* hover and pressed states on navy, deepest sections */

--gold: #DCB341        /* brand gold: accent on dark surfaces only */

--gold-deep: #8A6A15   /* darkened gold for links and small text on light backgrounds */

--ink: #0C0C14         /* body text, near-black, matches the logo artwork */

--ink-soft: #4A4F5E    /* secondary text and captions */

--paper: #FFFFFF       /* page background */

--mist: #F4F5F9        /* alternate section band, cool grey tinted toward the navy */

--rule: #DCE0EA        /* hairlines, dividers, table and card borders */

Colour discipline, and this matters:

- Navy carries structure. Header, footer, hero, closing band, primary buttons.

- Gold is an accent only. Active nav underline, ledger numerals, small markers, rules on dark bands, icon strokes. Never fill a large area with gold and never use it as a section background.

- #DCB341 on white has a contrast ratio of 1.99, which fails accessibility. Use --gold-deep for any gold-coloured link or small text on a light background. Reserve --gold for dark surfaces, where it reaches 8.5 against the navy.

- Body copy is --ink on --paper, never navy on white, which is too heavy at paragraph size.

Typography (Google Fonts):

- Display: "Newsreader" for page titles, section headings, pull quotes. Weights 400 and 500 only, tight leading, slight negative tracking at large sizes.

- Body: "Inter Tight" for all paragraphs, navigation, buttons, forms.

- Micro-label: "Inter Tight" set uppercase at 11px with 0.14em letter-spacing, for eyebrows, section labels, dates and categories. Use tabular figures for all numerals.

Set a clear modular type scale. Body copy at 17px with 1.65 line height and a max measure of 68 characters.

Layout: a 12-column grid with generous margins. Sections separated by whitespace and 1px hairline rules in --rule, not by alternating background blocks. Asymmetry is welcome, so headings can sit in a narrow left column with content in a wider right column.

## Signature element

The Practice Areas index, styled as a legal ledger. Each practice area is a full-width row with a numeral (01, 02, 03 and so on) set in the display face, the practice name beside it in the same face at a larger size, and a hairline rule beneath. On hover or focus, the row expands smoothly to reveal a two-sentence summary and the lead partner's name, and the numeral shifts from --ink to --gold-deep. Keyboard accessible, and on mobile it becomes a tap-to-expand accordion. This is the one memorable moment on the site, so keep everything else quiet and disciplined.

## Pages and routes

1. /: Home

2. /about: About Us

3. /practice-areas: index

4. /practice-areas/:slug: individual practice area

5. /team: Our People

6. /team/:slug: individual lawyer profile

7. /insights: articles index with search and category filter

8. /insights/:slug: article

9. /news: Firm News

10. /careers: Careers

11. /contact: Contact

12. /privacy, /terms: legal pages

13. 404 page

## Page specs

HOME

- Header: logo left, nav right, a text "Request a consultation" link. Transparent over the hero, then solid --ink on scroll with a subtle transition. Mobile: full-screen overlay menu.

- Hero: full-width, --navy background, one restrained line of display type stating what the firm does. No carousel. A single primary call to action and one secondary link. Optional: a very slow, subtle fade-in on load, nothing bouncy.

- Credibility strip: three or four short data points (years in practice, lawyers, practice areas, offices) set in the display face with micro-labels beneath, separated by vertical hairlines. Leave the numbers as clearly marked placeholders.

- Intro section: a two-column block, section label left, a short firm statement and a "More about the firm" link right.

- Practice Areas ledger (the signature element), showing all areas with a link to the full index.

- People teaser: a horizontal row of three or four portraits in tall 3:4 crops, greyscale by default, full colour on hover, with name and role beneath. Link to the full team.

- Insights teaser: the three most recent articles as a clean list with date, category and title. No card shadows.

- A quiet closing band on --ink with one line and a consultation call to action.

- Footer on --ink: logo, one-line description, practice area column, office addresses, phone, email, social icons, legal links, copyright.

ABOUT

Firm story, philosophy, mission and vision, and a "what sets us different" section as three or four numbered points. Include a slot for professional memberships and accreditations rendered as small greyscale logos on a light band, but leave it easy to remove if the client has none.

PRACTICE AREAS

Index uses the ledger. Each detail page: title, overview paragraph, a "What we do" list of services, a related-lawyers block, and a consultation call to action.

TEAM

A responsive grid of portraits, filterable by practice area, in consistent 3:4 crops with a uniform background treatment. Profile pages: portrait, name, role, practice areas, biography, year of call and qualifications, notable matters, email and LinkedIn.

INSIGHTS AND NEWS

Article list with featured image, date, category and title. Article pages: a readable single column at a 68-character measure, generous leading, styled blockquotes and headings, author byline linking to the lawyer's profile, estimated read time, and a related-articles block.

CONTACT

Split layout: a form on one side, office details on the other. Form fields: name, email, phone, subject, practice area (select), message. Real client-side validation with clear inline error messages, a loading state on submit, and a success state that confirms what happens next. An embedded map, and one clearly marked block per office.

CAREERS

Firm culture copy, a list of open roles, and an application form with CV file upload.

## Logo and brand assets

The logo is a classical serif wordmark reading ASSUAGE over ATTORNEYS, beneath a stylised letter A crossed by a swoosh, with a thin rule under the wordmark. It is supplied as transparent PNGs.

- On --navy surfaces (header, footer, closing band): use the white version.

- On --paper and --mist surfaces: use the black or navy version.

- Favicon and app icon: use the icon-only A mark on a --navy square.

- Never place the logo on a busy image, never recolour it to gold, never stretch or rotate it, and always give it clear space of at least the height of the A mark on all sides.

## Content handling

The client's real content has not arrived yet. Put ALL copy, practice areas, team members and articles in typed data files under src/data/ (site.ts, practiceAreas.ts, team.ts, insights.ts) so real content can be dropped in without touching components. Write placeholder copy that is plausible and professional for a Nigerian commercial law firm, and mark anything invented with a // TODO comment.

Critical: do not invent awards, rankings, client names, testimonials or accreditations anywhere in the copy. Nigerian legal practitioners are restricted in how they may advertise, so avoid superlatives such as "best", "leading" or "number one", and avoid any claim about results or success rates. Keep the tone factual and understated.

Use tall portrait placeholders for headshots and neutral architectural or documentary images elsewhere. Never gavels, scales of justice, or stock handshake photos.

## Quality requirements

- Fully responsive, designed mobile-first, tested down to 360px.

- Accessible: semantic HTML, visible keyboard focus rings, alt text on every image, colour contrast at AA or better, and prefers-reduced-motion respected on every animation.

- Motion is limited to short fades and gentle scroll reveals, 200–400ms, ease-out. Nothing springs, bounces or parallaxes.

- SEO: unique title and meta description per page, Open Graph tags, semantic heading order, a LegalService structured-data block, and clean slugs.

- Performance: lazy-load images below the fold, use modern image formats, and preload only the display font.

- Every interactive element gets hover, focus, active and disabled states.

Build it in React with Tailwind. Keep components small and reusable, and keep all design tokens in one file.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ed0963e8-83b8-4455-aa5e-18afea30c4ac).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

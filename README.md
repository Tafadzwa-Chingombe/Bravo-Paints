# Bravo Paints Website

A clean, modern, responsive and interactive marketing site for **Bravo Paints**, built from the Figma designs (Home, About, Contact and FAQ pages), with Bravo-styled Products, Colour Catalogue and Paint Calculator pages added.

Plain HTML, CSS and JavaScript: no frameworks and no build step.

## Quick start

Open `index.html` in a browser, or serve the folder locally:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Pages

| Page | File | Interactive features |
| --- | --- | --- |
| Home | `index.html` | Hero "mood" colour picker, colour-story cards, surface tabs (keyboard accessible), product cards with detail modal, gallery lightbox |
| About | `about.html` | Story, values and promise sections with scroll-reveal animations |
| Products | `products.html` | Filter by surface, live search, product detail modal (`?surface=` and `?product=` deep links) |
| Colour Catalogue | `colours.html` | Family filter (`?family=`), search by name/code/hex, sort, favourites (saved in the browser), colour details with copyable codes and pairings, **room visualiser** |
| Paint Calculator | `calculator.html` | Multi-room or direct-area mode, coats, surface condition, product coverage, best tin combination, print/save (`?product=` deep link) |
| FAQ | `faq.html` | Accordion, live search with highlighting, topic filter |
| Contact | `contact.html` | Validated contact form, live "Open now" badge (Lagos time), dealer search that opens Google Maps |

All pages share a glass-effect sticky header, a mobile menu, the "Bring your vision to life" call to action, a footer with newsletter sign-up, and a back-to-top button.

## Project structure

```
├── index.html, about.html, products.html, colours.html,
│   calculator.html, faq.html, contact.html
└── assets/
    ├── css/styles.css      # Design tokens (colours, type, spacing) + all styles
    ├── img/                # Logo + photography exported from Figma
    └── js/
        ├── data.js         # Products, colours, colour families (edit here)
        ├── main.js         # Shared: nav, reveal, modal, lightbox, toast, newsletter
        ├── home.js, products.js, colours.js,
        └── calculator.js, faq.js, contact.js   # Page-specific behaviour
```

## Before going live: checklist

1. **Replace the images with the originals.** Figma's image CDN wasn't reachable from the build environment, so the photos in `assets/img/` are crops taken from Figma exports. They're fine for review but are lower resolution than the source files. Export the originals from Figma (or use your own photography) and save them under **the same filenames** to swap them in; no code changes are needed. Images that need it most: `hero-living-room.jpg`, `about-hero.jpg`, `about-promise.jpg`, `faq-hero.jpg`, `map.jpg` and the `tin-*.jpg` product shots.
2. **Check product specs.** In `assets/js/data.js`, the coverage (m²/L), drying times and pack sizes are typical placeholder values. Replace them with the figures from the official technical data sheets. The Paint Calculator uses these numbers directly.
3. **Check colour names and codes.** The 47 colours and their `BP-xxxx` codes in `data.js` are placeholders. Replace them with your real colour card.
4. **Connect the forms.** The contact form and the newsletter validate input and show success messages, but they don't send anything yet. Look for the `TODO` comments in `assets/js/contact.js` and `assets/js/main.js`, then post the data to Formspree, Netlify Forms, Mailchimp or your own backend.
5. **Check contact details and social links.** The phone numbers, email and address come from the Figma design. The social icons currently point to the platforms' home pages.

## Editing tips

- **Brand colours and fonts** are CSS custom properties at the top of `assets/css/styles.css` (`--navy-900`, `--sky-500`, `--yellow-500`, `--royal-500`, and so on).
- **Header and footer** are repeated in each HTML file (there's no build step). When you change a nav link, update all seven pages.
- **Add a product or colour** by adding an entry to `assets/js/data.js`. The grids, filters, modals and calculator pick it up automatically.

## Accessibility and performance

- Semantic landmarks, a skip link, visible focus styles and ARIA tab, accordion and dialog patterns with keyboard support
- Respects `prefers-reduced-motion`
- Lazy-loaded images below the fold; there are no external JS dependencies (only Google Fonts)
- Tested at 1440px and 390px widths with no horizontal overflow

---

Designed by Tafadzwa Kevin Chingombe.

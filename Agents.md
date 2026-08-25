# AGENTS.md — Atelier Market Shopify Theme

Read this file before planning or writing any code. It applies to every task
in this repository, not just the one you were just given.

## What this repo is

An **original** Shopify Online Store 2.0 theme, built from scratch. A
separate theme (downloaded from a public source) was used only as loose
visual/feature inspiration during planning — **no code, CSS, JS, image
assets, copy, or trademarks from that or any other existing theme may be
copied into this repo, ever, even partially or "refactored."** Everything
here must be original work. If a task description references "the
reference theme," treat it as a feature checklist only, never as a source
to copy from.

This theme targets three buyer personas at once: (1) a merchant who wants
a good-looking store out of the box, (2) a merchant who wants to reskin it
into dozens of visually distinct variations via Theme Settings alone
(colors/fonts/layout only — no code edits), and (3) eventual submission to
the Shopify Theme Store, so current Theme Store technical requirements are
not optional.

## Non-negotiable constraints

- **Shopify OS 2.0 architecture**: JSON templates, sections everywhere,
  section groups for header/footer, theme blocks in `/blocks`.
- **No frameworks.** Hand-written Liquid, vanilla ES5-friendly JavaScript
  (no build step — files run as-is in the browser), and hand-written CSS
  using custom properties. No jQuery, no CSS framework, no bundler.
- **Mobile-first, accessible**: semantic HTML, visible keyboard focus,
  `aria-*` on interactive/disclosure widgets, works with JS disabled where
  Shopify natively supports it (cart form, localization form, search
  form, newsletter form all degrade to plain POST/GET).
- **Every visitor-facing string goes through the `t` filter** and a key in
  `locales/en.default.json` — never hard-code English copy in a `.liquid`
  file. See "Locales" below.
- **Don't guess at Shopify's Liquid API.** If you are not certain an
  object/filter/tag exists or behaves a certain way, either use one of the
  verified facts below, search Shopify's official theme documentation
  (shopify.dev) before using it, or flag the uncertainty in the PR
  description instead of shipping a guess. Shopify Liquid is a superset of
  standard Liquid with theme-specific objects/filters/tags that don't exist
  in generic Liquid docs — don't reason from generic Liquid alone.

## Target folder structure

```
config/               settings_schema.json, settings_data.json
layout/                theme.liquid, password.liquid
sections/              header-group.json, footer-group.json (section groups)
                        header.liquid, footer.liquid, cart-drawer.liquid
                        hero.liquid, featured-products.liquid, collection-grid.liquid,
                        testimonials.liquid, blog-posts.liquid, newsletter.liquid,
                        custom-content.liquid (generic @theme/@app block canvas)
                        main-product.liquid, main-collection.liquid, main-cart.liquid,
                        main-search.liquid, main-article.liquid, main-blog.liquid,
                        main-page.liquid, main-404.liquid
blocks/                heading.liquid, button.liquid (theme blocks, reusable via @theme)
snippets/               icon.liquid, meta-tags.liquid, structured-data-organization.liquid,
                        structured-data-product.liquid, breadcrumbs.liquid, pagination.liquid,
                        social-icons.liquid, language-switcher.liquid, currency-switcher.liquid,
                        cookie-consent.liquid, product-card.liquid, product-price.liquid,
                        variant-swatches.liquid, variant-picker.liquid, mega-menu.liquid,
                        off-canvas-menu.liquid, quick-view-modal.liquid
assets/                base.css, layout.css, components.css, animations.css, theme.js
templates/              index.json, product.json, collection.json, blog.json, article.json,
                        page.json, cart.json, search.json, 404.json
locales/               en.default.json, el.json, ru.json, de.json, fr.json, it.json,
                        es.json, nl.json
```

Before creating any file, check whether it already exists in the repo and
read it first — later phases build on earlier ones, and this project may
be worked on across several sequential tasks. Never blindly overwrite a
file that already has real content without reading it first.

## Design tokens (CSS custom property contract)

`layout/theme.liquid` defines these on `:root` via a `{% style %}` block,
generated from `settings_schema.json` values. Every asset CSS file must
consume these variables rather than hard-coding colors/fonts/spacing, so
the theme stays fully re-skinnable from Theme Settings alone:

```
--font-heading, --font-body            (font stacks, from font_picker settings)
--heading-scale, --body-scale          (unitless multipliers)
--heading-transform                    (uppercase | none)
--color-{background,surface,text,border,primary,primary-text,secondary,accent,error,success}-rgb
                                        (each an "R, G, B" triplet, no rgb() wrapper)
--color-{background,surface,text,border,primary,primary-text,secondary,accent,error,success}
                                        (each = rgb(var(--color-x-rgb)) — use these directly;
                                         use the -rgb versions only when you need alpha, e.g.
                                         rgba(var(--color-primary-rgb), .08) for a tint)
--page-width                           (px)
--spacing-scale                        (unitless multiplier for section padding)
--grid-gap                             (px)
--radius                               (px — corner radius used everywhere, buttons to cards)
--duration-multiplier                  (unitless; animations.css reads this)
```

Class naming: flat, mostly single-class selectors, BEM-ish
(`.block__element`, `.block--modifier`). Avoid nested selectors more than
2 levels deep — this project intentionally avoids specificity wars.

## JS hook contract (data-attributes)

`assets/theme.js` uses **event delegation exclusively** — listeners bound
to `document`, matching on `data-*` attributes — specifically so that
markup swapped in later via the Section Rendering API (the cart drawer)
keeps working without re-binding anything. Never bind a JS listener
directly to a specific element that might later be replaced wholesale.

Key attributes already in use (match these exactly when writing markup
that should be interactive; grep `assets/theme.js` for the full list
before inventing a new one):

| Attribute | Purpose |
|---|---|
| `data-off-canvas-trigger` / `data-off-canvas` / `data-off-canvas-close` | hamburger menu open/close |
| `data-accordion-trigger` / `data-accordion-panel` | off-canvas nested menu accordion |
| `data-search-trigger` / `data-predictive-search` / `data-predictive-search-input` / `data-predictive-search-results` | predictive search flyout |
| `data-cart-trigger` / `data-cart-count` | header cart icon + live count |
| `data-cart-drawer` / `data-cart-drawer-close` / `data-cart-drawer-content` | AJAX cart drawer (content is swapped via Section Rendering API) |
| `data-quantity-stepper` / `data-quantity-input` / `data-quantity-increase` / `data-quantity-decrease` / `data-line` | shared quantity stepper (cart drawer, cart page, product page) |
| `data-cart-remove` / `data-cart-note` | cart line removal / order note |
| `data-quick-view-trigger` / `data-quick-view` / `data-quick-view-body` / `data-quick-view-loading` | quick view modal, populated from `{product_url}.js` |
| `data-product-form` / `data-product-id` / `data-product-form-variant-id` | the product form wrapping every buy-box block |
| `data-buy-buttons` / `data-availability-message` / `data-add-to-cart` / `data-add-to-cart-text` | add-to-cart block internals |
| `data-variant-picker` / `data-variant-picker-json` / `data-option-position` / `data-selected-value` | variant picker, reads embedded product JSON, no extra fetch |
| `data-product-gallery` / `data-gallery-thumb` / `data-media-id` | product media gallery sync |
| `data-sticky-add-to-cart` | sticky bar, toggled via IntersectionObserver watching `[data-buy-buttons]` |
| `data-animate` / `data-animate-delay` | scroll-reveal targets |
| `data-collection-filters` / `data-filter-input` / `data-sort-select` | native Storefront Filtering, AJAX-refreshed |
| `data-localization-select` | language/currency `<select>`, auto-submits its form on change |
| `data-cookie-banner` / `data-cookie-accept` / `data-cookie-decline` | GDPR banner, consent stored in `localStorage` |

## Verified Shopify platform facts

These were confirmed against current Shopify documentation and are easy to
get subtly wrong from general Liquid knowledge alone. Follow them exactly:

1. **Header/footer must be section groups**, not static sections. Use
   `sections/header-group.json` and `sections/footer-group.json`
   (`{"type": "header", "sections": {"main-header": {"type": "header"}},
   "order": ["main-header"]}` — footer mirrors this), rendered in
   `theme.liquid` via `{% sections 'header-group' %}` /
   `{% sections 'footer-group' %}` (note: `sections`, plural tag, for
   groups — `{% section %}`, singular, for one static section like
   `cart-drawer`). This is a current Theme Store technical requirement.
2. **Global theme settings support `visible_if`.** Use it to hide
   dependent settings, e.g.:
   `"visible_if": "{{ settings.header_layout_style == 'mega_menu' }}"`.
3. **Theme blocks live in `/blocks`** and are referenced from a section's
   schema with `{"type": "@theme"}` (allows any theme block) or by exact
   type. **App blocks** are referenced with `{"type": "@app"}`. Per Theme
   Store requirements, `@app` blocks must be supported in the main
   product section and the featured-product section specifically — and
   remember that declaring `{"type": "@app"}` in schema is not enough,
   you must also render them: loop `section.blocks`, and for any block
   whose `block.type == '@app'`, call `{% render block %}`.
4. **Native product recommendations**: use the `{% recommendations %}`
   tag against `routes.product_recommendations_url`
   (`recommendations.performed`, `recommendations.products_count`,
   `recommendations.products`), re-fetched client-side via the Section
   Rendering API since the tag needs a live request context. Do not
   build a hand-rolled "related products" query.
5. **Do not hand-write hreflang tags.** Shopify automatically injects
   them via `content_for_header` once more than one language is
   published in Settings > Languages. Manually adding `<link
   rel="alternate" hreflang>` tags on top of that creates duplicates and
   can hurt SEO — just make sure `{{ content_for_header }}` is present in
   `<head>` and leave hreflang alone.
6. **`font_picker` default values** use the form `<handle>_n<weight>`,
   e.g. `"default": "work_sans_n4"`. Always append a plain system-font
   fallback after `settings.font_x.family` /
   `settings.font_x.fallback_families` in the CSS variable (e.g. `,
   'Segoe UI', Arial, sans-serif`) — this store ships Greek and Russian
   locales, and a merchant-picked font that lacks Cyrillic/Greek glyphs
   must still fall back to a legible system font rather than tofu boxes.
7. **Native variant swatches**: check `value.swatch.image` and
   `value.swatch.color` first (Shopify's built-in per-option-value
   swatch config in Admin) before falling back to using the option value
   string directly as a CSS color — the fallback only works when a
   merchant's option values happen to be valid CSS color keywords.
8. **The cart drawer is a section, not a snippet** precisely so it can be
   refreshed via the Section Rendering API
   (`?sections=cart-drawer` on any cart AJAX call, or pass
   `sections=cart-drawer` directly in the body of a `/cart/add.js`
   request to get updated HTML back in the same round trip) — this keeps
   money formatting and translated strings server-authoritative instead
   of reconstructed in JS.
9. **Collection filtering uses the native Storefront Filtering API**:
   `collection.filters`, each with `.type` (`list` | `price_range` |
   `boolean`), `.values` (each with `.label`, `.count`, `.active`,
   `.param_name`, `.value`), and for `price_range` specifically
   `.min_value` / `.max_value`. Don't build custom filter logic.
10. **`{% render %}` isolates scope.** Unlike the deprecated
    `{% include %}`, a rendered snippet does NOT inherit the calling
    template's local variables — global objects (`product`, `settings`,
    `cart`, `shop`, `routes`, `localization`, etc.) are still available
    everywhere, but anything else (`section`, a `{% liquid assign %}`
    variable, `block`) must be passed explicitly:
    `{% render 'x', section: section, product: product %}`.
11. **Liquid has no `ternary` filter.** Use `{% if %}` /
    `{% assign %}` to compute a value conditionally instead.
12. **Media has no universal tag filter.** Use `image_url` for images,
    `| video_tag` for native video, `| external_video_tag` for
    YouTube/Vimeo media, `| model_viewer_tag` for 3D models — branch on
    `media.media_type`.
13. **`settings_data.json` supports a `"presets"` object** — named bundles
    of setting overrides selectable from the theme editor's "Theme
    styles" picker. Use this (not a code fork) to ship the "hundreds of
    variations from one theme" requirement — add new presets rather than
    duplicating the theme.

## Locales

`locales/en.default.json` is the source of truth for every translation
key. Every other locale file (`el`, `ru`, `de`, `fr`, `it`, `es`, `nl`)
must have **exactly the same key structure** — same nesting, same key
names, only the values translated. Before finishing any task that adds a
new `| t` reference in a `.liquid` file, add the key to all 8 locale
files in the same task, not just `en.default.json`. Use natural,
professional translations, not machine-literal word-for-word — but flag
in the PR description that translations should get a native-speaker
review pass before the store goes live, especially `el.json` and
`ru.json`.

## Validation

Before opening a PR, validate what you wrote:

- If Shopify CLI can be installed in this environment
  (`npm install -g @shopify/cli` or the currently-documented method —
  check shopify.dev if the install command has changed), run
  `shopify theme check` from the repo root and fix everything it
  reports (syntax errors, deprecated Liquid, missing translation keys,
  invalid schema, etc.) before finishing the task.
- If Theme Check isn't available in this environment, do a manual pass
  instead: every `{% schema %}` block is valid JSON; every
  `{% render %}` / `{% section %}` / `{% sections %}` target file
  exists at the expected path; every `settings.<id>` referenced in
  Liquid exists in `config/settings_schema.json`; every `| t:` key
  referenced exists in `locales/en.default.json` (and all 7 other
  locale files); every image/product/collection/customer Liquid object
  attribute you used is one that's actually documented — don't invent
  attributes.
- There's no live Shopify store connected to this repo, so you cannot
  preview render output — reason carefully about correctness instead of
  assuming a preview would have caught mistakes.

# Aether Theme: Starter Variation Blueprint Guide

The **Aether Theme** is built on a highly modular, settings-driven architecture. All visual styling, typography, spacing, navigation modes, and layout behaviors are exposed through `config/settings_schema.json` and CSS custom properties (`assets/custom-properties.css`).

This allows merchants and agencies to rapidly generate **hundreds of unique theme variations** (e.g. Minimalist Luxury, Tech/Electronics, Eco-Friendly Organic, High-Contrast Flash Sale) simply by duplicating the theme folder and adjusting settings in `config/settings_data.json` without rewriting core Liquid or JavaScript code.

---

## 1. Fast Cloning & Theme Variation Process

To create a brand-new theme variation in under 5 minutes:
1. Copy the Aether Theme root folder to a new folder name (e.g., `theme_variation_luxury`).
2. Open `config/settings_data.json`.
3. Update the setting values under `"current"` mapping to your target store niche aesthetic.
4. (Optional) Define default color/font values in `assets/custom-properties.css`.

---

## 2. Setting Key Mappings & Preset Blueprint Examples

### Preset A: Minimalist Luxury (Jewelry, Fashion, High-End Cosmetics)
* **Header Layout**: `classic_dropdown`
* **Color Palette**:
  * `color_primary`: `#18181b` (Off-black)
  * `color_accent`: `#d4af37` (Soft Metallic Gold)
  * `color_background`: `#fafafa` (Warm Soft White)
  * `color_surface`: `#f4f4f5` (Light Slate)
* **Border Radius**: `0px` (Sharp, clean edges)
* **Animations**: Enabled (`true`)

### Preset B: Bold High-Tech (Electronics, Gaming, Gadgets)
* **Header Layout**: `mega_menu`
* **Color Palette**:
  * `color_primary`: `#0f172a` (Deep Slate)
  * `color_accent`: `#06b6d4` (Neon Cyan)
  * `color_background`: `#ffffff`
  * `color_surface`: `#f8fafc`
* **Border Radius**: `4px` (Modern slight rounding)
* **Animations**: Enabled (`true`)

### Preset C: Organic Eco-Friendly (Sustainable Goods, Food, Botanicals)
* **Header Layout**: `hamburger_only`
* **Color Palette**:
  * `color_primary`: `#1c1917` (Dark Bark)
  * `color_accent`: `#15803d` (Forest Green)
  * `color_background`: `#fdfbf7` (Natural Cream)
  * `color_surface`: `#f5f2eb`
* **Border Radius**: `16px` (Soft pill rounding)
* **Animations**: Enabled (`true`)

---

## 3. Global Settings Reference Table

| Setting ID | Options / Values | Description |
| :--- | :--- | :--- |
| `enable_animations` | `true` / `false` | Central toggle to enable/disable all animations & transitions globally. |
| `header_layout_style` | `classic_dropdown` / `mega_menu` / `hamburger_only` | Instantly switches desktop & mobile header layout structures. |
| `enable_mega_toggle_switch` | `true` / `false` | Secondary fallback toggle for mega menu. |
| `default_language` | `en`, `el`, `de`, `fr`, `it`, `es`, `nl`, `ru` | Native multi-language default selector (Cyprus, EU & Russian support). |
| `default_currency` | `EUR`, `USD`, `GBP`, `RUB` | Native multi-currency selector. |
| `date_format` | `dd_mm_yyyy` / `mm_dd_yyyy` | Regional date formatting switch. |
| `number_format_decimal` | `comma` / `dot` | Regional decimal separator switch. |
| `enable_cookie_consent` | `true` / `false` | GDPR cookie consent banner toggle. |
| `border_radius_style` | `0px`, `4px`, `8px`, `16px` | Dynamic CSS variable for global component rounding. |

---

## 4. Internationalization & Localization Mapping

When launching variations for Cyprus, EU, or Russian markets, ensure the proper locale file is referenced in `locales/`:
- `el.json` - Greek (Cyprus)
- `de.json` - German
- `ru.json` - Russian
- `fr.json` - French
- `it.json` - Italian
- `es.json` - Spanish
- `nl.json` - Dutch
- `en.default.json` - English (Default)

All string keys use Shopify's standard `t` filter (e.g. `{{ 'general.search' | t }}`) ensuring seamless translation across all store variations.

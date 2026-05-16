# Neon Noir

A single-page cyberpunk landing site for **Neon Noir**, a fictional private cyber-intelligence outfit (breach forensics, OSINT, threat hunting, data recovery).

Built with vanilla HTML / CSS / JS. No build step, no dependencies.

## Preview

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Or just open `index.html` directly in a browser via `file://`.

## What's in the box

- **Animated code rain** on the hero (`<canvas>` with magenta + cyan glyphs, pauses when hero is off-screen)
- **Glitch headline** with periodic RGB-split bursts
- **Inline SVG hooded silhouette** with magenta rim glow and gentle float
- **Neon-bordered cards** for services and case files
- **"Redacted" hover-reveal** spans in the case dossiers
- **Stats tiles** with magenta glow numerals
- **"Encrypted channel" contact form** with honeypot, validation, and a typed-out success state
- **Sticky nav** with scroll-spy, smooth scroll, and a mobile burger
- **Scanlines + grain overlays**, scroll-reveal animations
- Fully responsive, `prefers-reduced-motion` aware

## Files

```
index.html       # markup + inline SVGs
styles.css       # tokens, layout, components, animations
script.js        # code rain, nav, reveals, glitch, form
assets/
  favicon.svg    # neon NN monogram
  noise.svg      # SVG fractal-noise grain
```

## Palette

| Token | Hex |
|---|---|
| `--noir-bg` | `#0a0612` |
| `--neon-magenta` | `#ff2e9a` |
| `--electric-blue` | `#5b8cff` |
| `--cyber-cyan` | `#22e5ff` |
| `--violet-haze` | `#7a3cff` |
| `--ink` | `#e7e1ff` |

Fonts: Orbitron (display) + JetBrains Mono (body / code) via Google Fonts.

## Accessibility

- Semantic landmarks, `aria-labelledby` on sections, decorative SVGs hidden
- Visible focus rings, skip link, 44px-min touch targets
- `prefers-reduced-motion` disables canvas animation, glitch, float, and scroll reveals

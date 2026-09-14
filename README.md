# Fokus Freaks Creations — website

Plain HTML, CSS and JavaScript. No frameworks, no build step. Put the folder on
GitHub Pages (or any host) and it works.

## Files

```
index.html          home page
candid.html         Candid & traditional gallery
pre-wedding.html    Pre-wedding gallery
films.html          the three films
css/style.css       all the styling, in numbered sections
js/script.js        menu button, header, lightbox
assets/             all photographs and videos
```

## Where the ideas came from

| Part of the page | Borrowed from |
|---|---|
| Full-screen film hero | zadefilm.co.uk |
| Photograph held still while the words scroll over it | zadefilm.co.uk |
| Big tiles that open into their own galleries | ashleysmithphotos.com |
| The moving 35mm frame strip | built for this brief |

## Things you need to change before it goes live

1. **Instagram link.** The Facebook link is set to
   `https://www.facebook.com/FOKUSFREAKS10`. Instagram is still a guess — in
   every `.html` file, look for `TODO: swap in the studio's real Instagram
   address` in the reach bar at the top and paste the real profile URL.
2. **Film captions.** In `films.html`, replace "Wedding film" with the couple's
   names or the venue.
3. **The two collage images** — `assets/candid/candid-05.jpg` and
   `candid-07.jpg` — are Instagram-style grids with white gutters. They look
   out of place next to the single photographs. Replace them with one strong
   photograph each when you have them.
4. **Films 01 and 02** have a coloured border burned into the video itself.
   If you can re-export them without the frame, they'll sit much better on a
   dark page.

## How to add a photograph to a gallery

Drop the file into `assets/candid/` or `assets/pre-wedding/`, then add one line
inside the `<div class="gallery">` block of that page:

```html
<figure><img src="assets/candid/candid-09.jpg" alt="Say what is in the photo" loading="lazy"></figure>
```

The lightbox picks it up on its own. Remember to update the count shown on the
folder tile in `index.html` (`<span>8 photographs</span>`).

## How to add a frame to the moving strip

In `index.html`, find `<div class="strip__track">`. There are **two identical
sets** of frames — the second one is what makes the loop seamless. Add your new
frame to **both** sets, or the strip will jump.

## Spacing

All the vertical rhythm comes from four values at the top of `css/style.css`:

| Token | What it controls |
|---|---|
| `--band` | space above and below each section |
| `--band-sm` | the tighter version, used around the moving strip |
| `--pin-lead` / `--pin-gap` / `--pin-tail` | how far apart the closing lines scroll |

Raising `--pin-gap` makes the closing section longer to scroll through;
lowering it makes it tighter. Nothing else needs touching.

## Page transitions

The fade **in** is a CSS animation on `<body>` (`page-in`), so it works even if
the JavaScript fails — the page can never get stuck invisible. The fade **out**
is added by `script.js` when you click a link that stays inside the site.
Links to `#contact`, `tel:`, WhatsApp and Instagram are left alone, and the
class is cleared on every `pageshow` so Back and Forward never land on a blank
screen.

## Films

Only one film can play at a time. `script.js` listens to each video element's
own `play` event and pauses the others, so it works with the browser's native
controls too. Paused films keep their position. The rule is scoped to
`.films video`, so the hero video is never affected.

## Colours and type

Everything lives at the top of `css/style.css` under `:root`. Change a value
there and it updates across the whole site.

| Token | What it is |
|---|---|
| `--ink` | the dark background |
| `--bone` | main text colour |
| `--mist` | quieter grey text |
| `--muga` | the gold, named after muga silk |
| `--display` | Bodoni Moda, used for headings |
| `--text` | Jost, used for everything else |

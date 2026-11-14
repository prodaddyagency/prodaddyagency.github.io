# prodaddyagency.com: website files

Everything for the website is in this one folder. Upload the whole folder as it is.

```
prodaddyagency.com/
├── index.html        Home page: all text and sections, in order
├── privacy.html      Privacy Policy page
├── terms.html        Terms of Service page
├── css/style.css     Design: colours, fonts, spacing, animations
├── js/main.js        Behaviour: sample reels list, prices, clocks, animations
├── assets/images/    Logo, favicon, link-preview image (og.jpg)
├── assets/work/      Sample reels: name.mp4 (video) + name.jpg (cover)
└── README.md         This file
```

## Common changes

| I want to…                         | Open this file   | Look for                          |
|------------------------------------|------------------|-----------------------------------|
| Change prices                      | `js/main.js`     | `PRICES` (top of file)            |
| Add / remove a sample reel         | `js/main.js`     | `SAMPLE_REELS`, plus put `name.mp4` and `name.jpg` in `assets/work/` |
| Change the moving headline words   | `js/main.js`     | `ROTATING_WORDS`                  |
| Change any text on the page        | `index.html`     | the section comment, e.g. `<!-- ===== FAQ ===== -->` |
| Change brand colours               | `css/style.css`  | `:root` at the top                |
| Change email / WhatsApp number     | `index.html`     | search `hello@` or `916304430996` |

## Preview on this PC
Double-click `index.html`. It opens in the browser.

## Notes
- Sample reels are made from stock footage with example brand names. No client videos are used.
- Reel videos are 540x960 and about 1 MB each, so the site loads fast. Make new ones the same way
  (ffmpeg: `-vf scale=540:960 -crf 27 -movflags +faststart`).

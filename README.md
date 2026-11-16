# RelaySight site

Marketing site for [RelaySight](https://github.com/mnaza/relaysight),
a self-hosted video management system.

Static. No bundler, no framework, no build step. Open
`index.html` and it works.

## Why it is not in the core repository

The core is AGPL-3.0 and people run it themselves. A page selling
a hosted plan does not belong inside software someone
installs on their own hardware.

So it moved here. The core no longer links to it at all,
unless a deployment sets `brand.pricingUrl`.

## What came with it

The stylesheet was split by which page actually uses each
rule, not by hand. 103 rules here, 184 stayed with the
dashboard, 40 selectors are base chrome and live in both.

Locale files split the same way. Landing keys here, `app.*`
keys with the dashboard. 88 keys per language, three
languages.

## Tests

```
npm install
npm test
```

In jsdom. They check the contract, not the layout.

Every class the stylesheet styles is one the markup can
produce. Every custom property a brand can set is read by
some rule. Every key the page asks for exists in all three
locales, and every key a locale carries is one the page shows.

The page promises nothing that is not there: no call to
action leads to a hosted signup, and no paid plan lists
something the free core already ships.

There is no layout engine here, so nothing in this suite can
tell you a grid collapsed. That needs a real browser.

## Brand

`brand.json` sets the name, logo, palette and locale list.
`theme.js` applies it at load.

Unlike the dashboard this one is not white-label. It sells
one product under one name, so it carries no `--surface` and
no panel chrome.

## License

MIT.

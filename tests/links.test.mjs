// Links, which the repository split quietly broke.
//
// Three buttons pointed at app.html — the nav demo, the hero call-to-action and
// the closing one. app.html moved to the core repository and nothing noticed:
// every other test passed, and the page still rendered. A marketing page whose
// only three conversion links 404 is worse than no page.
//
// So: a relative href must name a file that exists here. Anything pointing at
// the dashboard has to go through the brand setting instead, which makes it one
// deployment decision rather than three strings in the markup.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { web } from './sources.mjs';

const html = readFileSync(join(web, 'index.html'), 'utf8');
const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);

test('every relative link names a file in this repository', () => {
  const local = hrefs.filter(h =>
    !h.startsWith('http') && !h.startsWith('//') && !h.startsWith('#') && !h.startsWith('mailto:'));
  const missing = local.filter(h => {
    const path = h.split('#')[0].replace(/^\//, '');
    if (path === '' || path.endsWith('/')) return false; // runtime target, checked below
    return !existsSync(join(web, path));
  });
  assert.deepEqual(missing, [], 'these links point at files that are not here');
});

test('every link to the dashboard is driven by the brand setting', () => {
  // The href in the markup is only the fallback. landing.js rewrites each one
  // from brand.appUrl at load, so a deployment that serves the dashboard
  // somewhere else changes one value.
  const toApp = [...html.matchAll(/<a[^>]*href="(\/app\/[^"]*)"[^>]*>/g)].map(m => m[0]);
  // Only the demo link is left: the two calls to action lead to the
  // repository's setup guide now, because there is no hosted signup to send
  // anyone to (claims.test.mjs).
  assert.ok(toApp.length >= 1, `expected the demo link, found ${toApp.length}`);
  for (const tag of toApp) {
    assert.match(tag, /data-app="/, `this link is not rewritten at runtime: ${tag}`);
  }
  const js = readFileSync(join(web, 'landing.js'), 'utf8');
  assert.match(js, /brand\.appUrl/, 'landing.js no longer reads brand.appUrl');
});

test('no link still points at the page that moved out', () => {
  assert.equal(hrefs.filter(h => h.includes('app.html')).length, 0);
});

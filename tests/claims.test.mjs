// What the page promises, checked against what exists.
//
// The page once sold "Try hosted with 3 cameras free" with no hosted signup
// behind it, and kept a dead Pro card selling alerts, remote access and
// customer accounts that the free core already ships. Copy rots the same way
// links do: nothing renders wrong, so nothing notices.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { web } from './sources.mjs';

const html = readFileSync(join(web, 'index.html'), 'utf8');
const en = JSON.parse(readFileSync(join(web, 'locales', 'en.json'), 'utf8'));

test('every English key is used by the page', () => {
  // A key nothing renders is copy nobody reviews, and the stale Pro card
  // survived exactly that way.
  const used = new Set([
    ...[...html.matchAll(/data-(?:i18n|list)="([^"]+)"/g)].map(m => m[1]),
  ]);
  const unused = Object.keys(en).filter(k => !used.has(k));
  assert.deepEqual(unused, [], 'these keys are rendered nowhere');
});

test('no call to action sends anyone to a hosted signup', () => {
  // There is no hosted onboarding. The way in is running it yourself.
  assert.doesNotMatch(html, /#onboarding/, 'a link still points at a hosted onboarding');
  const repo = [...html.matchAll(/href="(https:\/\/github\.com\/mnaza\/relaysight[^"]*)"/g)];
  assert.ok(repo.length >= 2, 'the hero and the closing call to action should both lead to the repository');
});

test('the page offers nothing free in the core as a paid extra', () => {
  const paid = ['pricing.cloud.items', 'pricing.enterprise.items'].map(k => en[k]).join('|');
  for (const free of [/\bSSO\b/, /\baudit\b/i, /\balerts?\b/i, /\bAPI\b/, /customer accounts/i]) {
    assert.doesNotMatch(paid, free, `a paid plan lists ${free}, which the core gives away`);
  }
});

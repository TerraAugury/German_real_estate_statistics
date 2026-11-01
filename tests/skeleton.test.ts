import { describe, expect, it } from 'vitest';
import { validate } from '../src/lib/i18n';
import { fmt } from '../src/lib/i18n';
import { slug, routes, langs } from '../src/lib/routes';

describe('i18n validation', () => {
  it('passes on matching sets', () => validate({ a: 'x {n}' }, { a: 'y {n}' }));
  it('fails on missing key', () => expect(() => validate({ a: 'x' }, {})).toThrow(/missing key/));
  it('fails on empty value', () => expect(() => validate({ a: 'x' }, { a: ' ' })).toThrow(/empty/));
  it('fails on placeholder mismatch', () => expect(() => validate({ a: '{n}' }, { a: '{m}' })).toThrow(/placeholder/));
});
it('formats with page locale', () => {
  expect(fmt('de', 1234.5)).toBe('1.234,5');
  expect(fmt('en', 1234.5)).toBe('1,234.5');
});
it('route table has every language for every page', () => {
  for (const k of Object.keys(routes)) for (const l of langs) expect(() => slug(k as keyof typeof routes, l)).not.toThrow();
});

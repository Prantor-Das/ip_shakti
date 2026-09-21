import { describe, expect, it } from 'vitest';
import { classifyFormulation } from './classification';

describe('classifyFormulation', () => {
  it('classifies nutraceutical at question one', () =>
    expect(classifyFormulation({ 1: 'yes' })?.type).toBe('nutraceutical'));
  it('classifies cosmetic at question two', () =>
    expect(classifyFormulation({ 1: 'no', 2: 'yes' })?.type).toBe('cosmetic'));
  it('classifies classical at question three', () =>
    expect(classifyFormulation({ 1: 'no', 2: 'no', 3: 'yes' })?.type).toBe('classical'));
  it('classifies proprietary at question four', () =>
    expect(classifyFormulation({ 1: 'no', 2: 'no', 3: 'no', 4: 'yes' })?.type).toBe('proprietary'));
  it('classifies phytopharmaceutical at question five yes', () =>
    expect(classifyFormulation({ 1: 'no', 2: 'no', 3: 'no', 4: 'no', 5: 'yes' })?.type).toBe(
      'phytopharmaceutical'
    ));
  it('classifies new-drug at question five no', () =>
    expect(classifyFormulation({ 1: 'no', 2: 'no', 3: 'no', 4: 'no', 5: 'no' })?.type).toBe(
      'new-drug'
    ));
  it('returns unsure from every question', () => {
    expect(classifyFormulation({ 1: 'unsure' })?.type).toBe('unsure');
    expect(classifyFormulation({ 1: 'no', 2: 'unsure' })?.type).toBe('unsure');
    expect(classifyFormulation({ 1: 'no', 2: 'no', 3: 'unsure' })?.type).toBe('unsure');
    expect(classifyFormulation({ 1: 'no', 2: 'no', 3: 'no', 4: 'unsure' })?.type).toBe('unsure');
    expect(classifyFormulation({ 1: 'no', 2: 'no', 3: 'no', 4: 'no', 5: 'unsure' })?.type).toBe(
      'unsure'
    );
  });
  it('returns no result while waiting for the next answer', () =>
    expect(classifyFormulation({ 1: 'no' })).toBeNull());
});

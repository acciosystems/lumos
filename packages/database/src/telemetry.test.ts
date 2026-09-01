import { describe, expect, test } from 'bun:test';

import { classifyDatabaseError } from './telemetry';

describe('classifyDatabaseError', () => {
  test('classifies Neon connection saturation as acquisition pressure', () => {
    expect(classifyDatabaseError({ code: '53300' })).toBe('acquisition');
    expect(classifyDatabaseError({ message: 'remaining connection slots are reserved' })).toBe(
      'acquisition',
    );
  });
});

import * as v from 'valibot';

type NeonConnectionMode = 'direct' | 'pooled';

export function databaseUrlSchema(mode: NeonConnectionMode) {
  return v.pipe(
    v.string(),
    v.url(),
    v.check(isPostgresUrl, 'Expected a PostgreSQL connection URL.'),
    v.check(
      mode === 'pooled' ? isPooledNeonUrl : isDirectNeonUrl,
      `Expected Neon's ${mode} connection URL.`,
    ),
  );
}

function isPostgresUrl(value: string) {
  const protocol = new URL(value).protocol;
  return protocol === 'postgres:' || protocol === 'postgresql:';
}

function isPooledNeonUrl(value: string) {
  const hostname = new URL(value).hostname;
  return !hostname.endsWith('.neon.tech') || hostname.includes('-pooler.');
}

function isDirectNeonUrl(value: string) {
  const hostname = new URL(value).hostname;
  return !hostname.endsWith('.neon.tech') || !hostname.includes('-pooler.');
}

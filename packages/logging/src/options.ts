import { env } from '@lumos/env/logging';
import type { DrainContext } from 'evlog';
import { createAxiomDrain } from 'evlog/axiom';
import type { IdentifyOptions } from 'evlog/better-auth';
import { createDrainPipeline, type PipelineDrainFn } from 'evlog/pipeline';

let drain: PipelineDrainFn<DrainContext> | undefined;

export function getDrain(): PipelineDrainFn<DrainContext> {
  if (drain) return drain;

  const pipeline = createDrainPipeline<DrainContext>({
    batch: { size: 50, intervalMs: 5000 },
    retry: { maxAttempts: 3 },
  });
  drain = pipeline(
    createAxiomDrain({
      apiKey: env.AXIOM_TOKEN,
      dataset: env.AXIOM_DATASET,
    }),
  );
  return drain;
}

export const identifyOptions: IdentifyOptions = {
  maskEmail: true,
  fields: ['id', 'name', 'username', 'email', 'image', 'createdAt'],
  // remove duplicated userId field
  extend: (_) => ({ userId: undefined }),
};

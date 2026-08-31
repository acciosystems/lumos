# Campaign payload budgets

Production runs on Vercel Functions. Vercel limits both request and response
payloads to 4.5 MB.

The application rejects request bodies larger than 1 MiB at the Nitro boundary.
Campaign validation limits strings, collection points, evidence references, and
page sizes so that campaign JSON responses and their SSR hydration data remain
well below 1 MiB.

Campaign images and accountability files are uploaded directly to R2. Their
binary bytes do not pass through the Vercel Function request body.

Review this budget whenever the provider, RPC transport, campaign response
shape, or upload architecture changes.

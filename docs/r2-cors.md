# R2 browser uploads

Browser uploads use presigned `PUT` URLs, so the R2 bucket must allow the web
application's origin. Without a bucket CORS policy, browsers reject the
preflight request even when the presigned URL is valid.

`r2-cors.example.json` is a Wrangler-compatible policy for local development.
It covers avatar, campaign-image, and accountability-evidence uploads:

```sh
bunx wrangler r2 bucket cors set lumos --file docs/r2-cors.example.json
bunx wrangler r2 bucket cors list lumos
```

R2 must also expire abandoned staging objects independently of the application.
The application cleans up eagerly, but it cannot observe a browser that uploads
an object and then closes before confirmation. Apply the prefix-scoped lifecycle
rule as part of bucket provisioning:

```sh
bunx wrangler r2 bucket lifecycle set lumos --file docs/r2-lifecycle.example.json
bunx wrangler r2 bucket lifecycle list lumos
```

`lifecycle set` replaces the bucket's lifecycle configuration. Merge the
staging expiration rules into the exported configuration first when the
bucket already has other lifecycle rules.

Before applying it outside local development, replace
`http://localhost:3000` with the exact application origin (scheme, host, and
optional port; no trailing slash). Keep `PUT` and both request headers because
the client sends `Content-Type` and `If-None-Match` with the presigned upload.
Add `GET` when the browser needs to read objects from the bucket through the
S3 endpoint. In the dashboard's JSON editor, use the dashboard field names for
the same rule:

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedHeaders": ["content-type", "if-none-match"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

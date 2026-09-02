import { fileURLToPath } from 'node:url';

const functionDirectory = fileURLToPath(
  new URL('../.vercel/output/functions/__server.func/', import.meta.url),
);
const functionConfigPath = `${functionDirectory}/.vc-config.json`;
const functionConfig = (await Bun.file(functionConfigPath).json()) as {
  maxDuration?: number;
  runtime?: string;
  supportsResponseStreaming?: boolean;
};

if (
  functionConfig.runtime !== 'bun1.x' ||
  functionConfig.maxDuration !== 60 ||
  functionConfig.supportsResponseStreaming !== true
) {
  throw new Error('The generated Vercel function does not match the production runtime contract.');
}

const modulePaths = Array.from(
  new Bun.Glob('**/*.mjs').scanSync({ cwd: functionDirectory, absolute: true, onlyFiles: true }),
).toSorted();

if (modulePaths.length === 0) {
  throw new Error('The generated Vercel function contains no server modules.');
}

await Promise.all(
  modulePaths.map(async (modulePath) => {
    const check = Bun.spawn(['node', '--check', modulePath], {
      stdout: 'pipe',
      stderr: 'pipe',
    });
    const exitCode = await check.exited;

    if (exitCode !== 0) {
      const diagnostic = await new Response(check.stderr).text();
      throw new Error(`Invalid generated server module: ${modulePath}\n${diagnostic}`);
    }
  }),
);

process.stdout.write(`Verified ${modulePaths.length} generated Vercel server modules.\n`);

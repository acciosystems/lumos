import type { ErrorComponentProps } from '@tanstack/react-router';

export function ErrorBoundary({ error }: ErrorComponentProps) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-y-4">
      <h1 className="text-8xl font-bold">Whoops!</h1>
      <h2 className="text-4xl font-semibold">{error.name}</h2>
      <p>{error.message}</p>
    </div>
  );
}

import { createFileRoute } from '@tanstack/react-router';

import { AppInset } from '@/components/sidebar/inset';

export const Route = createFileRoute('/(app)/')({
  component: HomePage,
});

function HomePage() {
  return (
    <AppInset breadcrumbs={[{ label: 'Home' }]}>
      <p>Hello, World!</p>
    </AppInset>
  );
}

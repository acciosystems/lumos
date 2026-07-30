import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/(special)')({
  component: SpecialLayout,
});

function SpecialLayout() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Outlet />
    </div>
  );
}

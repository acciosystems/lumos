import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return <p className={cn('font-brand', className)}>Nossa Causa</p>;
}

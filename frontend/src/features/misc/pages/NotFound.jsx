import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '../../../components/ui';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-[var(--color-teal-light)] text-[var(--color-teal-dark)]">
        <Compass className="size-7" />
      </div>
      <h1 className="text-xl font-bold text-[var(--color-navy)]">Page not found</h1>
      <p className="max-w-sm text-sm text-[var(--color-slate)]">
        We couldn't find the page you were looking for.
      </p>
      <Button as={Link} to="/">Back home</Button>
    </div>
  );
}

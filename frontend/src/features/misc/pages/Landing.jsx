import { Link } from 'react-router-dom';
import { Truck, Calculator, Calendar, MapPin } from 'lucide-react';
import { Button } from '../../../components/ui';

const FEATURES = [
  { icon: MapPin, title: 'Pin your move', desc: 'Mark pickup and destination on the map and add the addresses.' },
  { icon: Calculator, title: 'Instant quotes', desc: 'Get a cost breakdown based on distance, hours, and items.' },
  { icon: Calendar, title: 'Book a move', desc: 'Confirm a moving date and track its status from your dashboard.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg gradient-primary text-white">
            <Truck className="size-4" />
          </div>
          <span className="text-[15px] font-bold text-[var(--color-navy)]">SmartMove</span>
        </div>
        <div className="flex items-center gap-2">
          <Button as={Link} to="/login" variant="ghost" size="sm">Log in</Button>
          <Button as={Link} to="/register" size="sm">Get started</Button>
        </div>
      </header>

      <section className="gradient-soft px-6 py-20 text-center">
        <h1 className="mx-auto max-w-2xl text-4xl font-extrabold tracking-tight text-[var(--color-navy)] sm:text-5xl">
          Moving houses, without the chaos.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[var(--color-slate)]">
          Get an instant quote and book your move — all in one calm, organized place.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button as={Link} to="/register" size="lg">Start your move</Button>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-[var(--radius-card)] border border-[var(--color-border)] p-5">
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-[var(--color-teal-light)] text-[var(--color-teal-dark)]">
                <Icon className="size-5" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-[var(--color-navy)]">{title}</h3>
              <p className="text-sm text-[var(--color-slate)]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--color-border)] px-6 py-6 text-center text-xs text-[var(--color-slate)]">
        SmartMove · Nairobi, Kenya
      </footer>
    </div>
  );
}

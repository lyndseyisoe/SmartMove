import { MapPin } from 'lucide-react';

export default function MapUnavailable({ label = 'Map preview' }) {
  return (
    <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] text-center">
      <MapPin className="size-6 text-[var(--color-slate)]" />
      <p className="text-sm text-[var(--color-slate)]">
        {label} needs a Google Maps API key. Set{' '}
        <code className="rounded bg-white px-1 py-0.5 text-xs">VITE_GOOGLE_MAPS_API_KEY</code> in
        your .env file.
      </p>
    </div>
  );
}

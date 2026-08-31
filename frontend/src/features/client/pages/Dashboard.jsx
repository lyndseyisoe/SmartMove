import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Calculator, Calendar, ArrowRight, MapPin, Clock3, Plus, PackageCheck } from 'lucide-react';
import { Card, CardBody, Badge, Button } from '../../../components/ui';

export default function ClientDashboard() {
  const user = useSelector((s) => s.auth.user);
  const bookings = useSelector((s) => s.bookings.list);
  const activeBooking = bookings?.find((b) => ['pending', 'confirmed', 'in_progress'].includes(b.status));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="fade-up flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--color-teal)]">Your moving space</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--color-navy)]">Good morning, {user?.name?.split(' ')[0] || 'there'} <span className="inline-block">👋</span></h1>
        <p className="mt-1 text-sm text-[var(--color-slate)]">Here’s where your move stands right now.</p></div>
        <Button as={Link} to="/client/quote" size="sm" className="w-fit rounded-full"><Plus className="size-4" /> New move</Button>
      </div>

      {activeBooking ? (
        <Card className="shimmer gradient-primary overflow-hidden text-white">
          <CardBody className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-white/65">Next up · active move</p>
              <p className="mt-2 text-2xl font-bold">{activeBooking.pickupAddress || 'Your move'}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/70"><span className="flex items-center gap-1"><MapPin className="size-3.5" /> Pickup location</span><span className="flex items-center gap-1"><Clock3 className="size-3.5" /> Move in progress</span><Badge color="neutral" className="bg-white/20 text-white">{activeBooking.status}</Badge></div>
            </div>
            <Button
              as={Link}
              to={`/client/bookings/${activeBooking.id}`}
              variant="secondary"
              className="bg-white text-[var(--color-teal-dark)] hover:bg-white/90"
            >
              View details <ArrowRight className="ml-1 size-4" />
            </Button>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-[var(--color-teal-light)] text-[var(--color-teal-dark)]">
              <Calendar className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-navy)]">No active move yet</h3>
              <p className="text-sm text-[var(--color-slate)]">Start with a quote, then book a move.</p>
            </div>
            <Button as={Link} to="/client/quote">Get a quote</Button>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <QuickLink to="/client/quote" icon={Calculator} title="Get a quote" desc="Estimate your moving cost" />
        <QuickLink to="/client/book" icon={Calendar} title="Book a move" desc="Choose your moving date" />
        <QuickLink to="/client/bookings" icon={PackageCheck} title="Your bookings" desc="Every move, past and upcoming" />
      </div>
    </div>
  );
}

function QuickLink({ to, icon: Icon, title, desc }) {
  return (
    <Link to={to}>
      <Card hoverable className="group">
        <CardBody className="flex items-center gap-3 p-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-teal-light)] text-[var(--color-teal-dark)]">
            <Icon className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[var(--color-navy)]">{title}</p>
            <p className="truncate text-xs text-[var(--color-slate)]">{desc}</p>
          </div><ArrowRight className="ml-auto size-4 text-[var(--color-slate)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-teal)]" />
        </CardBody>
      </Card>
    </Link>
  );
}

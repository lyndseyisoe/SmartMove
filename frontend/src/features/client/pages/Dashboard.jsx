import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Calculator, Calendar, Truck, ArrowRight } from 'lucide-react';
import { Card, CardBody, Badge, Button } from '../../../components/ui';

export default function ClientDashboard() {
  const user = useSelector((s) => s.auth.user);
  const bookings = useSelector((s) => s.bookings.list);
  const activeBooking = bookings?.find((b) => ['pending', 'confirmed', 'in_progress'].includes(b.status));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">Hi {user?.name?.split(' ')[0] || 'there'} 👋</h1>
        <p className="text-sm text-[var(--color-slate)]">Here's where your move stands right now.</p>
      </div>

      {activeBooking ? (
        <Card className="gradient-primary text-white">
          <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-white/80">Active move</p>
              <p className="mt-1 text-lg font-semibold">{activeBooking.pickupAddress || 'Your move'}</p>
              <Badge color="neutral" className="mt-1 bg-white/20 text-white">{activeBooking.status}</Badge>
            </div>
            <Button
              as={Link}
              to={`/client/bookings/${activeBooking.id}`}
              variant="secondary"
              className="bg-white text-[var(--color-teal-dark)] hover:bg-white/90"
            >
              View booking <ArrowRight className="ml-1 size-4" />
            </Button>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="flex flex-col items-center gap-3 py-10 text-center">
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <QuickLink to="/client/quote" icon={Calculator} title="Get a Quote" desc="Estimate your moving cost" />
        <QuickLink to="/client/bookings" icon={Truck} title="Your Bookings" desc="Every move, past and upcoming" />
      </div>
    </div>
  );
}

function QuickLink({ to, icon: Icon, title, desc }) {
  return (
    <Link to={to}>
      <Card hoverable>
        <CardBody className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-teal-light)] text-[var(--color-teal-dark)]">
            <Icon className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-[var(--color-navy)]">{title}</p>
            <p className="truncate text-xs text-[var(--color-slate)]">{desc}</p>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

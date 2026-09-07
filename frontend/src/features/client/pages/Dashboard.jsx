import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Calculator, Calendar, ArrowRight, MapPin, Clock3, Plus, PackageCheck, UserRound, MessageCircle, CheckCircle2, Briefcase } from 'lucide-react';
import { Card, CardBody, CardHeader, Badge, Button, LoadingState } from '../../../components/ui';
import { formatDate } from '../../../utils/format';
import moverProfileApi from '../../../services/moverProfileApi';
import messagesApi from '../../../services/messagesApi';

export default function Dashboard() {
  const user = useSelector((s) => s.auth.user);
  if (user?.role === 'mover') {
    return <MoverDashboard user={user} />;
  }
  return <ClientDashboard user={user} />;
}

function ClientDashboard({ user }) {
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

function MoverDashboard({ user }) {
  const [profile, setProfile] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      moverProfileApi.get().catch(() => null),
      messagesApi.conversations().catch(() => []),
    ]).then(([profileData, conversationsData]) => {
      if (!active) return;
      setProfile(profileData);
      setConversations(conversationsData);
    }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const recentJobs = conversations.slice(0, 5);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="fade-up flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--color-teal)]">Mover dashboard</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--color-navy)]">Welcome back, {user?.name?.split(' ')[0] || 'there'} <span className="inline-block">👋</span></h1>
          <p className="mt-1 text-sm text-[var(--color-slate)]">Here's your SmartMove marketplace status.</p>
        </div>
        <Button as={Link} to="/mover/profile" size="sm" className="w-fit rounded-full"><UserRound className="size-4" /> Edit profile</Button>
      </div>

      {!loading && profile && !profile.profile_complete && (
        <Card className="border-[#d97706]/30 bg-[#fef3e2]">
          <CardBody className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#9a6700]">Your profile isn't complete yet</p>
              <p className="text-sm text-[#9a6700]/80">Clients can't find or book you until your company name, service area, and pricing are set.</p>
            </div>
            <Button as={Link} to="/mover/profile" size="sm" variant="secondary">Complete profile</Button>
          </CardBody>
        </Card>
      )}

      {!loading && profile?.profile_complete && (
        <Card className="gradient-primary text-white">
          <CardBody className="flex items-center gap-3 p-6">
            <CheckCircle2 className="size-6 shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-white/70">Marketplace status</p>
              <p className="text-lg font-semibold">Your profile is live and visible to clients</p>
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-[var(--color-navy)]">Recent jobs</h2>
        </CardHeader>
        <CardBody>
          {loading ? (
            <LoadingState label="Loading your jobs..." />
          ) : recentJobs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Briefcase className="size-8 text-[var(--color-slate)]" />
              <p className="text-sm font-medium text-[var(--color-navy)]">No jobs yet</p>
              <p className="text-sm text-[var(--color-slate)]">Jobs appear here once a client books you.</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[var(--color-border)]">
              {recentJobs.map((c) => (
                <div key={c.booking_id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--color-navy)]">{c.other_user?.name || 'Client'}</p>
                    <p className="truncate text-xs text-[var(--color-slate)]">
                      {formatDate(c.booking?.moving_date)} · {c.booking?.pickup_address || '—'}
                    </p>
                  </div>
                  <Badge status={c.booking?.status} />
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <QuickLink to="/client/messages" icon={MessageCircle} title="Messages" desc="Conversations with your clients" />
        <QuickLink to="/mover/profile" icon={UserRound} title="My profile" desc="Company info, service area, pricing" />
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

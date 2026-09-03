import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, ShieldCheck, Truck, UserRound } from 'lucide-react';
import moversApi from '../../../services/moversApi';
import { Card, CardBody, Spinner } from '../../../components/ui';

export default function Movers() {
  const [movers, setMovers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // setLoading(true) lives in the input's onChange (a normal event handler)
  // instead of at the top of the effect below — calling setState
  // synchronously inside an effect body triggers cascading renders and is
  // flagged by react-hooks/set-state-in-effect. The effect's own setState
  // calls are all inside the .then/.catch/.finally callbacks, which is fine.
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setLoading(true);
  };

  useEffect(() => {
    let active = true;
    moversApi.list(search).then((data) => {
      if (active) setMovers(data);
    }).catch(() => {
      if (active) setError('We could not load movers right now. Please try again.');
    }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [search]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 fade-up">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--color-teal)]">Mover marketplace</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight">Find your moving team</h1><p className="mt-1 max-w-lg text-sm leading-6 text-[var(--color-slate)]">Browse mover accounts connected to SmartMove and choose who you’d like to work with.</p></div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-slate)]"><ShieldCheck className="size-4 text-[var(--color-teal)]" /> Registered SmartMove movers</div>
      </div>

      <div className="flex max-w-xl items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 shadow-[var(--shadow-card)] focus-within:border-[var(--color-teal)] focus-within:ring-2 focus-within:ring-[var(--color-teal-light)]"><Search className="size-5 text-[var(--color-slate)]" /><input value={search} onChange={handleSearchChange} placeholder="Search by mover name" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-slate)]" /></div>

      {error && <p className="rounded-xl bg-[#fde8e8] px-4 py-3 text-sm text-[#dc2626]">{error}</p>}
      {loading ? <div className="flex justify-center py-16"><Spinner /></div> : movers.length === 0 ? <Card><CardBody className="flex flex-col items-center gap-3 py-16 text-center"><div className="flex size-14 items-center justify-center rounded-2xl bg-[var(--color-teal-light)] text-[var(--color-teal-dark)]"><Truck className="size-7" /></div><h2 className="text-lg font-bold">No movers found</h2><p className="max-w-sm text-sm leading-6 text-[var(--color-slate)]">Completed mover profiles will appear here when they are ready to receive bookings.</p></CardBody></Card> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{movers.map((mover) => <Card key={mover.id} hoverable className="group"><CardBody className="p-6"><div className="flex items-start justify-between"><div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--color-teal-light)] text-[var(--color-teal-dark)]"><UserRound className="size-6" /></div><span className="rounded-full bg-[#e3f7e9] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#15803d]">Available</span></div><h2 className="mt-5 text-lg font-bold">{mover.company_name || mover.name}</h2><p className="mt-1 text-sm font-medium text-[var(--color-navy)]">{mover.name}</p><p className="mt-1 text-xs text-[var(--color-slate)]">{mover.service_area}</p>{mover.bio && <p className="mt-3 line-clamp-2 text-xs leading-5 text-[var(--color-slate)]">{mover.bio}</p>}<div className="mt-4 rounded-xl bg-[var(--color-bg)] px-3 py-2 text-xs font-semibold text-[var(--color-navy)]">KES {mover.pricing_type === 'hourly' ? mover.price_per_hour : mover.price_per_distance} / {mover.pricing_type === 'hourly' ? 'hour' : 'km'}</div><div className="mt-6 flex items-center justify-between border-t border-[var(--color-border)] pt-4"><span className="text-xs text-[var(--color-slate)]">Ready for bookings</span><Link to={`/client/book?mover=${mover.id}`} className="flex items-center gap-1 text-xs font-bold text-[var(--color-teal-dark)] transition group-hover:gap-2">Choose <ArrowRight className="size-3.5" /></Link></div></CardBody></Card>)}</div>}
      <p className="text-center text-xs text-[var(--color-slate)]">Mover details shown here come directly from registered SmartMove accounts.</p>
    </div>
  );
}

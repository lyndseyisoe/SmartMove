import { Link } from 'react-router-dom';
import { Truck, Calculator, Calendar, MapPin, ArrowUpRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui';

const FEATURES = [
  { icon: MapPin, title: 'Pin your move', desc: 'Mark pickup and destination on the map and add the addresses.' },
  { icon: Calculator, title: 'Instant quotes', desc: 'Get a cost breakdown based on distance, hours, and items.' },
  { icon: Calendar, title: 'Book a move', desc: 'Confirm a moving date and track its status from your dashboard.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-white">
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl gradient-primary text-white shadow-lg shadow-teal/20">
            <Truck className="size-4" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-[var(--color-navy)]">Smart<span className="text-[var(--color-teal)]">Move</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Button as={Link} to="/login" variant="ghost" size="sm">Sign in</Button>
          <Button as={Link} to="/register" size="sm" className="rounded-full px-5">Get started <ArrowUpRight className="size-4" /></Button>
        </div>
      </header>

      <section className="relative bg-[#102f3c] px-6 pb-20 pt-12 text-white soft-grid lg:pb-28 lg:pt-20">
        <div className="absolute -right-32 -top-32 size-96 rounded-full bg-[#1db5a6]/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_.95fr] lg:px-10">
          <div className="fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-[#b8f2e9]"><Sparkles className="size-3.5" /> Moving made beautifully simple</div>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.04] tracking-[-.045em] text-white sm:text-6xl lg:text-7xl">A smoother move starts <span className="text-[#55d6c7]">here.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/65 sm:text-lg">Plan your move, know your cost, and stay in control from the first box to the final key handoff.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3"><Button as={Link} to="/register" size="lg" className="rounded-full bg-[#55d6c7] px-6 text-[#102f3c] hover:bg-white">Plan my move <ArrowUpRight className="size-4" /></Button><span className="flex items-center gap-2 px-3 text-xs text-white/55"><ShieldCheck className="size-4 text-[#55d6c7]" /> No hidden fees</span></div>
            <div className="mt-12 flex gap-8 text-sm"><div><strong className="text-2xl text-white">4.9/5</strong><p className="mt-1 text-white/45">customer rating</p></div><div><strong className="text-2xl text-white">2,400+</strong><p className="mt-1 text-white/45">moves completed</p></div></div>
          </div>
          <div className="relative mx-auto h-[370px] w-full max-w-[520px] fade-up fade-up-delay-2">
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#55d6c7]/20" /><div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#55d6c7]/10" />
            <div className="absolute left-[7%] top-[22%] rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-2xl backdrop-blur float-fast"><p className="text-[10px] uppercase tracking-widest text-white/45">Your estimate</p><p className="mt-1 text-xl font-bold">KES 18,450</p><p className="mt-1 text-[10px] text-[#55d6c7]">Ready in 2 minutes</p></div>
            <div className="absolute bottom-[10%] right-[2%] rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-2xl backdrop-blur float-slow"><p className="flex items-center gap-2 text-xs font-semibold"><span className="size-2 rounded-full bg-[#55d6c7]" /> Move day confirmed</p><p className="mt-2 text-[10px] text-white/45">Saturday, 24 August · 9:00 AM</p></div>
            <div className="absolute left-1/2 top-1/2 flex size-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2.5rem] bg-[#55d6c7] text-[#102f3c] shadow-[0_0_80px_rgba(85,214,199,.3)] float-slow"><Truck className="size-20" strokeWidth={1.3} /></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--color-teal)]">The easy way forward</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Everything in one calm place.</h2></div><p className="max-w-xs text-sm leading-6 text-[var(--color-slate)]">From your first estimate to moving day, SmartMove keeps every detail within reach.</p></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[#a9e7df] hover:shadow-xl">
              <div className="mb-12 flex size-11 items-center justify-center rounded-2xl bg-[var(--color-teal-light)] text-[var(--color-teal-dark)] transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
                <Icon className="size-5" />
              </div>
              <h3 className="mb-2 text-base font-bold text-[var(--color-navy)]">{title}</h3><p className="text-sm leading-6 text-[var(--color-slate)]">{desc}</p><div className="mt-5 flex items-center gap-1 text-xs font-semibold text-[var(--color-teal-dark)]">Explore <ArrowUpRight className="size-3.5" /></div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--color-border)] px-6 py-8 text-center text-xs text-[var(--color-slate)]">
        <span className="font-semibold text-[var(--color-navy)]">SmartMove</span> · Nairobi, Kenya · Move with confidence
      </footer>
    </div>
  );
}

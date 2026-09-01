import { Link } from 'react-router-dom';
import { Truck, Check, Sparkles } from 'lucide-react';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen bg-[#f4f8f7]">
      <div className="relative hidden w-[46%] overflow-hidden bg-[#102f3c] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 top-1/4 size-96 rounded-full bg-[#1db5a6]/20 blur-3xl" />
        <Link to="/" className="relative flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#55d6c7] text-[#102f3c]"><Truck className="size-[18px]" /></div>
          <span className="text-lg font-extrabold">SmartMove</span>
        </Link>
        <div className="relative max-w-md">
          <div className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-[#55d6c7]"><Sparkles className="size-3.5" /> Your move, made simple</div>
          <h2 className="text-5xl font-extrabold leading-[1.05] tracking-[-.04em] text-white">A little less moving stress.</h2>
          <p className="mt-5 leading-7 text-white/60">SmartMove brings your quote, booking, and move day details together in one easy place.</p>
          <div className="mt-8 space-y-3 text-sm text-white/75"><p className="flex items-center gap-3"><Check className="size-4 text-[#55d6c7]" /> Upfront, transparent estimates</p><p className="flex items-center gap-3"><Check className="size-4 text-[#55d6c7]" /> Trusted moving support</p><p className="flex items-center gap-3"><Check className="size-4 text-[#55d6c7]" /> Everything organized for you</p></div>
        </div>
        <p className="relative text-xs text-white/35">Move with confidence · Nairobi, Kenya</p>
      </div>
      <div className="flex w-full items-center justify-center px-4 py-10 lg:w-[54%]">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 lg:hidden">
          <div className="flex size-9 items-center justify-center rounded-lg gradient-primary text-white">
            <Truck className="size-[18px]" />
          </div>
          <span className="text-lg font-bold text-[var(--color-navy)]">Smart<span className="text-[var(--color-teal)]">Move</span></span>
        </Link>

        <div className="rounded-[24px] border border-[var(--color-border)] bg-white p-7 shadow-[0_20px_60px_rgba(16,42,67,.08)] sm:p-9">
          <h1 className="text-xl font-bold text-[var(--color-navy)]">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-[var(--color-slate)]">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>

        {footer && <div className="mt-5 text-center text-sm text-[var(--color-slate)]">{footer}</div>}
      </div>
      </div>
    </div>
  );
}

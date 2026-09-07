import { useEffect, useState } from 'react';
import { Building2, CheckCircle2, DollarSign, MapPin, Save, Truck } from 'lucide-react';
import { Button, Card, CardBody, Input, Select } from '../../../components/ui';
import moverProfileApi from '../../../services/moverProfileApi';

export default function MoverProfile() {
  const [form, setForm] = useState({ company_name: '', phone: '', bio: '', service_area: '', pricing_type: 'hourly', price: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    moverProfileApi.get().then((profile) => {
      if (profile) setForm({ company_name: profile.company_name || '', phone: profile.phone || '', bio: profile.bio || '', service_area: profile.service_area || '', pricing_type: profile.pricing_type || 'hourly', price: profile.pricing_type === 'distance' ? profile.price_per_distance || '' : profile.price_per_hour || '' });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setSaved(false); setError('');
    try { await moverProfileApi.save({ company_name: form.company_name, phone: form.phone, bio: form.bio, service_area: form.service_area, pricing_type: form.pricing_type, [form.pricing_type === 'hourly' ? 'price_per_hour' : 'price_per_distance']: form.price }); setSaved(true); } catch (err) { setError(err.response?.data?.error || 'Unable to save your profile.'); } finally { setSaving(false); }
  };

  if (loading) return <div className="py-16 text-center text-sm text-[var(--color-slate)]">Loading your mover profile...</div>;
  return <div className="mx-auto flex max-w-4xl flex-col gap-6 fade-up"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--color-teal)]">Mover account</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight">Create your marketplace profile</h1><p className="mt-1 max-w-xl text-sm leading-6 text-[var(--color-slate)]">Complete this profile so clients can discover you, compare your pricing, and start a conversation after booking.</p></div><Card><CardBody className="p-6 sm:p-8"><form onSubmit={submit} className="flex flex-col gap-5"><div className="flex items-center gap-3 rounded-2xl bg-[var(--color-teal-light)] p-4 text-sm text-[var(--color-teal-dark)]"><div className="flex size-10 items-center justify-center rounded-xl bg-white"><Truck className="size-5" /></div><p><strong>Your profile powers the marketplace.</strong><br /><span className="text-xs">Only complete profiles are visible to clients.</span></p></div><div className="grid gap-5 sm:grid-cols-2"><Input label="Business / team name" placeholder="e.g. SwiftMove Logistics" value={form.company_name} onChange={update('company_name')} required /><Input label="Phone number" placeholder="+254 700 000 000" value={form.phone} onChange={update('phone')} /><Input label="Service area" placeholder="e.g. Nairobi & Kiambu" value={form.service_area} onChange={update('service_area')} required /><Select label="How do you charge?" value={form.pricing_type} onChange={update('pricing_type')}><option value="hourly">Per hour</option><option value="distance">Per kilometer</option></Select></div><div><label htmlFor="bio" className="mb-1.5 block text-sm font-medium text-[var(--color-navy)]">About your service</label><textarea id="bio" value={form.bio} onChange={update('bio')} rows="4" placeholder="Tell clients what makes your moving service a great fit..." className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/20" /></div><div className="rounded-2xl border border-[var(--color-border)] p-4"><p className="flex items-center gap-2 text-sm font-bold"><DollarSign className="size-4 text-[var(--color-teal)]" /> Your rate</p><div className="mt-3 flex items-end gap-3"><div className="flex-1"><Input label={form.pricing_type === 'hourly' ? 'Price per hour' : 'Price per kilometer'} type="number" min="0.01" step="0.01" placeholder="0.00" value={form.price} onChange={update('price')} required /></div><span className="mb-2 text-sm text-[var(--color-slate)]">KES / {form.pricing_type === 'hourly' ? 'hour' : 'km'}</span></div><p className="mt-2 text-xs text-[var(--color-slate)]">Clients will see this rate before choosing you. You can update it anytime.</p></div>{error && <p className="rounded-lg bg-[#fde8e8] px-3.5 py-2.5 text-sm text-[#dc2626]">{error}</p>}{saved && <p className="flex items-center gap-2 text-sm text-[#15803d]"><CheckCircle2 className="size-4" /> Profile saved and ready for the marketplace.</p>}<div className="flex justify-end"><Button type="submit" loading={saving}><Save className="size-4" /> Save profile</Button></div></form></CardBody></Card><div className="grid gap-3 sm:grid-cols-3"><Mini icon={Building2} title="Be discoverable" text="Show up in client searches" /><Mini icon={DollarSign} title="Set your rate" text="Transparent pricing upfront" /><Mini icon={MapPin} title="Share your area" text="Reach nearby clients" /></div></div>;
}

function Mini({ icon: Icon, title, text }) { return <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white p-4"><Icon className="size-5 text-[var(--color-teal)]" /><div><p className="text-xs font-bold">{title}</p><p className="mt-0.5 text-[10px] text-[var(--color-slate)]">{text}</p></div></div>; }

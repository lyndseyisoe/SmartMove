import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, LockKeyhole, Smartphone } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, Input, LoadingState } from '../../../components/ui';
import { fetchBookingById } from '../../bookings/bookingSlice';
import paymentApi from '../../../services/paymentApi';
import { formatKES } from '../../../utils/format';

export default function PaymentCheckout() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const booking = useSelector((state) => state.bookings.selected);
  const [phone, setPhone] = useState('');
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { dispatch(fetchBookingById(id)); }, [dispatch, id]);
  useEffect(() => {
    if (!payment || payment.status !== 'pending') return undefined;
    const timer = setInterval(() => paymentApi.status(payment.id).then(setPayment), 4000);
    return () => clearInterval(timer);
  }, [payment]);

  if (!booking || String(booking.id) !== id) return <LoadingState label="Loading checkout..." />;
  const startPayment = async (event) => {
    event.preventDefault(); setError(''); setLoading(true);
    try { const result = await paymentApi.start(id, phone); setPayment(result.payment); } catch (err) { setError(err.response?.data?.error || 'Unable to start M-Pesa checkout.'); } finally { setLoading(false); }
  };

  return <div className="mx-auto flex max-w-xl flex-col gap-6 fade-up"><Link to={`/client/bookings/${id}`} className="flex items-center gap-2 text-sm font-semibold text-[var(--color-teal-dark)] hover:underline"><ArrowLeft className="size-4" /> Back to booking</Link><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--color-teal)]">Secure checkout</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight">Pay with M-Pesa</h1><p className="mt-1 text-sm text-[var(--color-slate)]">Booking #{booking.id} · Your payment is processed securely by Safaricom.</p></div><Card><CardBody className="p-6 sm:p-8"><div className="flex items-center justify-between rounded-2xl bg-[var(--color-bg)] p-4"><div><p className="text-xs text-[var(--color-slate)]">Amount due</p><p className="mt-1 text-2xl font-extrabold text-[var(--color-navy)]">{formatKES(booking.estimatedCost)}</p></div><div className="flex size-12 items-center justify-center rounded-xl bg-[#42b649] text-white"><Smartphone className="size-6" /></div></div>{payment?.status === 'paid' ? <div className="flex flex-col items-center gap-3 py-10 text-center"><CheckCircle2 className="size-14 text-[#15803d]" /><h2 className="text-xl font-bold">Payment received</h2><p className="text-sm text-[var(--color-slate)]">Receipt: {payment.receipt_number || 'Confirmed'}.</p><Button as={Link} to={`/client/bookings/${id}`}>Return to booking</Button></div> : <form onSubmit={startPayment} className="mt-6 flex flex-col gap-5"><Input label="M-Pesa phone number" type="tel" placeholder="0712 345 678" value={phone} onChange={(event) => setPhone(event.target.value)} hint="You’ll receive an STK Push on this number." required />{payment?.status === 'pending' && <p className="rounded-xl bg-[#fff4d6] px-4 py-3 text-sm text-[#9a6700]">Check your phone and enter your M-Pesa PIN to complete payment.</p>}{payment?.status === 'failed' && <p className="rounded-xl bg-[#fde8e8] px-4 py-3 text-sm text-[#dc2626]">{payment.result_description || 'Payment was not completed. Try again.'}</p>}{error && <p className="rounded-xl bg-[#fde8e8] px-4 py-3 text-sm text-[#dc2626]">{error}</p>}<Button type="submit" loading={loading || payment?.status === 'pending'} disabled={payment?.status === 'pending'} className="w-full"><LockKeyhole className="size-4" /> {payment?.status === 'pending' ? 'Waiting for payment' : 'Send M-Pesa prompt'}</Button><p className="text-center text-xs text-[var(--color-slate)]">Never share your M-Pesa PIN with anyone.</p></form>}</CardBody></Card></div>;
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Check, CheckCheck, Image, MapPin, MessageCircle, MoreHorizontal, Phone, Plus, Send, Smile, Truck } from 'lucide-react';
import messagesApi from '../../../services/messagesApi';
import { STATUS_META } from '../../../utils/constants';

export default function Messages() {
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    messagesApi.conversations().then((items) => {
      const nextChats = items.map((item) => ({
        id: item.booking_id,
        bookingId: item.booking_id,
        name: item.other_user?.name || 'Move participant',
        initials: (item.other_user?.name || 'MP').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
        color: 'bg-[#d9f5ef] text-[#087f78]',
        preview: item.last_message?.body || 'Start a conversation about this move.',
        time: item.last_message?.created_at ? new Date(item.last_message.created_at).toLocaleDateString() : 'New',
        unread: item.unread_count,
        bookingStatus: item.booking?.status,
        pickupAddress: item.booking?.pickup_address,
      }));
      setChats(nextChats);
      setSelected((current) => current || nextChats[0] || null);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected?.bookingId) return;
    messagesApi.list(selected.bookingId).then((items) => setMessages(items.map((item) => ({
      id: item.id,
      from: item.sender_id === user?.id ? 'me' : 'them',
      text: item.body,
      time: new Date(item.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      readAt: item.read_at,
    }))));
  }, [selected, user?.id]);

  const sendMessage = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    if (!selected?.bookingId) return;
    messagesApi.send(selected.bookingId, text).then((message) => {
      setMessages((current) => [...current, { id: message.id, from: 'me', text: message.body, time: 'Now', readAt: null }]);
      setChats((current) => current.map((chat) => chat.id === selected.id ? { ...chat, preview: message.body, time: 'Now' } : chat));
      setDraft('');
    });
  };

  const selectedSubtitle = selected
    ? [STATUS_META[selected.bookingStatus]?.label, selected.pickupAddress].filter(Boolean).join(' · ') || 'Move participant'
    : '';

  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col gap-5 fade-up">
      <div className="flex items-center justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--color-teal)]">Stay connected</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight">Messages</h1><p className="mt-1 text-sm text-[var(--color-slate)]">Keep every moving detail in one conversation.</p></div>
        <button className="flex size-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-slate)] transition hover:border-[var(--color-teal)] hover:text-[var(--color-teal)]" aria-label="Start a new conversation"><Plus className="size-5" /></button>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden rounded-[22px] border border-[var(--color-border)] bg-white shadow-[0_12px_45px_rgba(16,42,67,.06)]">
        <aside className={`${selected ? 'hidden md:flex' : 'flex'} w-full shrink-0 flex-col border-r border-[var(--color-border)] md:w-[310px]`}>
          <div className="border-b border-[var(--color-border)] p-4"><div className="flex items-center gap-2 rounded-xl bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-slate)]"><MessageCircle className="size-4" /> All conversations</div></div>
          <div className="flex-1 overflow-y-auto p-2">
            {loading && <p className="p-4 text-sm text-[var(--color-slate)]">Loading conversations...</p>}
            {!loading && chats.length === 0 && <div className="p-5 text-center"><MessageCircle className="mx-auto size-7 text-[var(--color-teal)]" /><p className="mt-3 text-sm font-semibold">No conversations yet</p><p className="mt-1 text-xs leading-5 text-[var(--color-slate)]">Your client or mover conversations will appear here once a booking is connected.</p></div>}
            {chats.map((chat) => <button key={chat.id} onClick={() => setSelected(chat)} className={`flex w-full gap-3 rounded-xl p-3 text-left transition ${selected?.id === chat.id ? 'bg-[var(--color-teal-light)]' : 'hover:bg-[var(--color-bg)]'}`}>
              <div className={`relative flex size-11 shrink-0 items-center justify-center rounded-full text-xs font-bold ${chat.color}`}>{chat.initials}</div>
              <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="truncate text-sm font-bold text-[var(--color-navy)]">{chat.name}</p><span className="shrink-0 text-[10px] text-[var(--color-slate)]">{chat.time}</span></div><div className="mt-1 flex items-center justify-between gap-2"><p className="truncate text-xs text-[var(--color-slate)]">{chat.preview}</p>{chat.unread > 0 && <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-teal)] text-[10px] font-bold text-white">{chat.unread}</span>}</div></div>
            </button>)}
          </div>
          <div className="border-t border-[var(--color-border)] p-4"><Link to="/client/bookings" className="flex items-center gap-2 text-xs font-semibold text-[var(--color-teal-dark)] hover:underline"><Truck className="size-4" /> View your move details</Link></div>
        </aside>

        <section className={`${selected ? 'flex' : 'hidden md:flex'} min-w-0 flex-1 flex-col`}>
          <header className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3.5 sm:px-6"><div className="flex items-center gap-3"><button onClick={() => setSelected(null)} className="rounded-lg p-1 text-[var(--color-slate)] hover:bg-[var(--color-bg)] md:hidden" aria-label="Back to conversations"><ArrowLeft className="size-5" /></button><div className="flex size-10 items-center justify-center rounded-full bg-[#d9f5ef] text-xs font-bold text-[#087f78]">{selected?.initials}</div><div><p className="text-sm font-bold">{selected?.name}</p><p className="truncate text-xs text-[var(--color-slate)]">{selectedSubtitle}</p></div></div><div className="flex items-center gap-1 text-[var(--color-slate)]"><button className="rounded-lg p-2 hover:bg-[var(--color-bg)]" aria-label="Call contact"><Phone className="size-4" /></button><button className="rounded-lg p-2 hover:bg-[var(--color-bg)]" aria-label="More options"><MoreHorizontal className="size-5" /></button></div></header>
          <div className="flex-1 space-y-4 overflow-y-auto bg-[#fbfdfc] p-4 sm:p-6"><div className="my-1 text-center text-[10px] font-semibold uppercase tracking-widest text-[var(--color-slate)]">Today</div>{messages.map((message) => <div key={message.id} className={`flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[82%] sm:max-w-[65%] ${message.from === 'me' ? 'items-end' : 'items-start'} flex flex-col`}><div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${message.from === 'me' ? 'rounded-br-md bg-[#087f78] text-white' : 'rounded-bl-md border border-[var(--color-border)] bg-white text-[var(--color-navy)]'}`}>{message.text}</div><div className="mt-1 flex items-center gap-1 px-1 text-[10px] text-[var(--color-slate)]">{message.time}{message.from === 'me' && (message.readAt ? <CheckCheck className="size-3 text-[var(--color-teal)]" aria-label="Read" /> : <Check className="size-3" aria-label="Sent" />)}</div></div></div>)}</div>
          <form onSubmit={sendMessage} className="border-t border-[var(--color-border)] bg-white p-3 sm:p-4"><div className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 focus-within:border-[var(--color-teal)] focus-within:ring-2 focus-within:ring-[var(--color-teal-light)]"><button type="button" className="text-[var(--color-slate)] hover:text-[var(--color-teal)]" aria-label="Add attachment"><Image className="size-5" /></button><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message..." className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-[var(--color-navy)] outline-none placeholder:text-[var(--color-slate)]" /><button type="button" className="hidden text-[var(--color-slate)] hover:text-[var(--color-teal)] sm:block" aria-label="Add emoji"><Smile className="size-5" /></button><button type="submit" className="flex size-9 items-center justify-center rounded-xl bg-[var(--color-teal)] text-white transition hover:scale-105 hover:bg-[var(--color-teal-dark)]" aria-label="Send message"><Send className="size-4" /></button></div><p className="mt-2 hidden items-center gap-1 px-2 text-[10px] text-[var(--color-slate)] sm:flex"><MapPin className="size-3" /> Keep your conversations inside SmartMove</p></form>
        </section>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Card, CardBody, CardHeader, Badge, Select, Input, SaveToggle, LoadingState } from '../../../components/ui';
import { fetchBookingById } from '../../bookings/bookingSlice';
import bookingApi from '../../../services/bookingApi';
import { formatDate } from '../../../utils/format';
import { BOOKING_STATUS, STATUS_META } from '../../../utils/constants';

export default function BookingDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const booking = useSelector((s) => s.bookings.selected);

  useEffect(() => {
    dispatch(fetchBookingById(id));
  }, [dispatch, id]);

  if (!booking || String(booking.id) !== id) return <LoadingState label="Loading booking..." />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-navy)]">Booking #{booking.id}</h1>
          <p className="text-sm text-[var(--color-slate)]">{formatDate(booking.moveDate)}</p>
        </div>
        <Badge status={booking.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-sm font-semibold text-[var(--color-navy)]">Details</h2>
          </CardHeader>
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Detail label="Pickup" value={booking.pickupAddress || '—'} full />
            <Detail label="Destination" value={booking.destinationAddress || '—'} full />
            <Detail label="Move date" value={formatDate(booking.moveDate)} />
            <Detail label="Mover ID" value={booking.moverId ?? '—'} />
          </CardBody>
        </Card>
        <ManageBookingCard key={booking.id} booking={booking} onSaved={() => dispatch(fetchBookingById(id))} />
      </div>
    </div>
  );
}

function ManageBookingCard({ booking, onSaved }) {
  const [status, setStatus] = useState(booking.status);
  const [moveDate, setMoveDate] = useState(booking.moveDate || '');

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-[var(--color-navy)]">Manage booking</h2>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          {Object.values(BOOKING_STATUS).map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].label}
            </option>
          ))}
        </Select>
        <Input label="Move date" type="date" value={moveDate} onChange={(e) => setMoveDate(e.target.value)} />
        <SaveToggle
          label="Save changes"
          onSave={async () => {
            await bookingApi.update(booking.id, { status, moveDate });
            onSaved();
          }}
        />
      </CardBody>
    </Card>
  );
}

function Detail({ label, value, full }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <p className="text-xs text-[var(--color-slate)]">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-[var(--color-navy)]">{value}</p>
    </div>
  );
}

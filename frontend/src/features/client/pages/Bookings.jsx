import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Card, CardBody, Badge, Button, LoadingState, EmptyState, ErrorState } from '../../../components/ui';
import { fetchBookings } from '../../bookings/bookingSlice';
import { formatDate } from '../../../utils/format';

export default function Bookings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, error } = useSelector((s) => s.bookings);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-navy)]">Your Bookings</h1>
          <p className="text-sm text-[var(--color-slate)]">Every move, past and upcoming.</p>
        </div>
        <Button as={Link} to="/client/book">New booking</Button>
      </div>

      {loading ? (
        <LoadingState label="Loading bookings..." />
      ) : error ? (
        <ErrorState onAction={() => dispatch(fetchBookings())} />
      ) : list.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No bookings yet"
          description="You haven't booked a move yet."
          actionLabel="Get a quote"
          onAction={() => navigate('/client/quote')}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((b) => (
            <Link key={b.id} to={`/client/bookings/${b.id}`}>
              <Card hoverable>
                <CardBody className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--color-navy)]">{b.pickupAddress || `Booking #${b.id}`}</p>
                    <p className="text-xs text-[var(--color-slate)]">{formatDate(b.moveDate)}</p>
                  </div>
                  <Badge status={b.status} />
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

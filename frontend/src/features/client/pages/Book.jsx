import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Button, Input, Steps } from '../../../components/ui';
import { createBooking } from '../../bookings/bookingSlice';

const STEP_LABELS = ['Mover', 'Move Details', 'Confirm'];

export default function Book() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { creating, createError } = useSelector((s) => s.bookings);
  const lastQuoteRequest = useSelector((s) => s.quotes.lastRequest);

  const [step, setStep] = useState(1);
  const [moverId, setMoverId] = useState('');
  const [moveDate, setMoveDate] = useState('');

  const handleConfirm = async () => {
    const result = await dispatch(
      createBooking({
        moverId: Number(moverId),
        moveDate,
        pickup: lastQuoteRequest?.pickup,
        pickupAddress: lastQuoteRequest?.pickupAddress,
        destination: lastQuoteRequest?.destination,
        destinationAddress: lastQuoteRequest?.destinationAddress,
      })
    );
    if (createBooking.fulfilled.match(result)) {
      navigate(`/client/bookings/${result.payload.id}`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">Book a Move</h1>
        <p className="text-sm text-[var(--color-slate)]">Confirm the details and you're set.</p>
      </div>

      <Steps steps={STEP_LABELS} current={step} />

      {!lastQuoteRequest?.pickupAddress && (
        <Card className="border-[#d97706]/30 bg-[#fef3e2]">
          <CardBody className="text-sm text-[#d97706]">
            Get a quote first so we have your pickup and destination on file — booking needs those details.
          </CardBody>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <CardBody className="flex flex-col gap-4">
            <Input
              label="Mover ID"
              type="number"
              min="1"
              placeholder="e.g. 3"
              value={moverId}
              onChange={(e) => setMoverId(e.target.value)}
              hint="There's no mover directory to browse yet — enter the ID of the mover account you're booking."
            />
            <div>
              <Button disabled={!moverId} onClick={() => setStep(2)}>
                Continue
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardBody className="flex flex-col gap-4">
            <Input
              label="Move date"
              type="date"
              value={moveDate}
              onChange={(e) => setMoveDate(e.target.value)}
            />
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button disabled={!moveDate} onClick={() => setStep(3)}>Continue</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardBody className="flex flex-col gap-4">
            <h2 className="font-semibold text-[var(--color-navy)]">Review your booking</h2>
            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <Row label="Mover ID" value={moverId} />
              <Row label="Move date" value={moveDate} />
              <Row label="Pickup" value={lastQuoteRequest?.pickupAddress || '—'} />
              <Row label="Destination" value={lastQuoteRequest?.destinationAddress || '—'} />
            </dl>
            {createError && <p className="text-sm text-[#dc2626]">{createError}</p>}
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
              <Button loading={creating} disabled={!lastQuoteRequest?.pickupAddress} onClick={handleConfirm}>
                Confirm booking
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-[var(--color-slate)]">{label}</dt>
      <dd className="font-medium text-[var(--color-navy)]">{value}</dd>
    </div>
  );
}

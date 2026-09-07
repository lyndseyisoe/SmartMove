import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Calculator } from 'lucide-react';
import { Card, CardBody, CardHeader, Button, Input, Select, Spinner } from '../../../components/ui';
import RouteMapPicker from '../../../components/maps/RouteMapPicker';
import { estimateQuote } from '../../quotes/quoteSlice';
import { formatKES } from '../../../utils/format';
import { haversineKm } from '../../../utils/distance';

export default function Quote() {
  const dispatch = useDispatch();
  const { estimate, loading, error } = useSelector((s) => s.quotes);

  const [pickup, setPickup] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [destination, setDestination] = useState(null);
  const [destinationAddress, setDestinationAddress] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('2');
  const [itemCount, setItemCount] = useState('10');
  const [floorNumber, setFloorNumber] = useState('0');
  const [hasElevator, setHasElevator] = useState('true');

  const distanceKm = pickup && destination ? haversineKm(pickup, destination) : null;
  const canSubmit = pickup && destination && pickupAddress.trim() && destinationAddress.trim() && estimatedHours;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    dispatch(
      estimateQuote({
        distanceKm,
        estimatedHours: Number(estimatedHours),
        itemCount: Number(itemCount),
        floorNumber: Number(floorNumber),
        hasElevator: hasElevator === 'true',
        pickup,
        pickupAddress: pickupAddress.trim(),
        destination,
        destinationAddress: destinationAddress.trim(),
      })
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">Get a Quote</h1>
        <p className="text-sm text-[var(--color-slate)]">
          Pin your pickup and destination and tell us a bit about the move — we'll estimate the cost.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-[var(--color-navy)]">Pick your route</h2>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <div className="h-[360px]">
              <RouteMapPicker
                pickup={pickup}
                destination={destination}
                onPickupChange={setPickup}
                onDestinationChange={setDestination}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                placeholder="Pickup address, e.g. Kilimani, Nairobi"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
              />
              <Input
                placeholder="Destination address, e.g. Westlands, Nairobi"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
              />
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-sm font-semibold text-[var(--color-navy)]">Move details</h2>
          </CardHeader>
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Input
              label="Estimated hours"
              type="number"
              min="0"
              step="0.5"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              hint="How long the move is likely to take"
            />
            <Input
              label="Number of items"
              type="number"
              min="0"
              value={itemCount}
              onChange={(e) => setItemCount(e.target.value)}
              hint="Roughly how many items you're moving"
            />
            <Select label="Elevator at destination?" value={hasElevator} onChange={(e) => setHasElevator(e.target.value)}>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Select>
            <Input
              label="Floor number"
              type="number"
              min="0"
              value={floorNumber}
              onChange={(e) => setFloorNumber(e.target.value)}
              disabled={hasElevator === 'true'}
              hint={hasElevator === 'true' ? 'Only matters without an elevator' : 'Ground floor is 0'}
            />
          </CardBody>
        </Card>

        {distanceKm != null && (
          <p className="text-sm text-[var(--color-slate)]">
            Straight-line distance: ~{distanceKm} km
          </p>
        )}

        <div>
          <Button type="submit" loading={loading} disabled={!canSubmit}>
            <Calculator className="size-4" /> Calculate estimate
          </Button>
        </div>
      </form>

      {error && (
        <Card>
          <CardBody className="text-sm text-[#dc2626]">{error}</CardBody>
        </Card>
      )}

      {loading && (
        <Card>
          <CardBody className="flex items-center gap-2 text-sm text-[var(--color-slate)]">
            <Spinner size={16} /> Calculating your estimate...
          </CardBody>
        </Card>
      )}

      {estimate && !loading && (
        <Card className="gradient-primary text-white">
          <CardBody className="flex flex-col gap-4">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-white/80">Estimated cost</p>
                <p className="mt-1 text-3xl font-extrabold">{formatKES(estimate.total_estimate)}</p>
              </div>
              <Button as={Link} to="/client/book" variant="secondary" className="bg-white text-[var(--color-teal-dark)] hover:bg-white/90">
                Continue to booking
              </Button>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-1 border-t border-white/20 pt-3 text-sm text-white/90 sm:grid-cols-3">
              <BreakdownRow label="Base fee" value={estimate.base_fee} />
              <BreakdownRow label="Distance" value={estimate.distance_charge} />
              <BreakdownRow label="Labour" value={estimate.labour_charge} />
              <BreakdownRow label="Items" value={estimate.item_charge} />
              <BreakdownRow label="Floor surcharge" value={estimate.floor_charge} />
            </dl>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

function BreakdownRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-white/70">{label}</dt>
      <dd className="font-medium">{formatKES(value)}</dd>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Package, CheckCircle2, Circle, Truck } from 'lucide-react';
import { Card, CardBody, CardHeader, Input, Button, LoadingState, Badge } from '../../../components/ui';
import trackingApi from '../../../services/trackingApi';
import RouteMapPicker from '../../../components/maps/RouteMapPicker';

const STATUS_OPTIONS = [
  { value: 'packed', label: 'Packed', icon: Package, color: 'bg-[var(--color-teal-light)] text-[var(--color-teal-dark)]' },
  { value: 'in_transit', label: 'In transit', icon: Truck, color: 'bg-[#fff4d6] text-[#9a6700]' },
  { value: 'delivered', label: 'Delivered', icon: CheckCircle2, color: 'bg-[#d1fae5] text-[#15803d]' },
];

export default function Tracking() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newItem, setNewItem] = useState('');
  const [adding, setAdding] = useState(false);

  const loadItems = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await trackingApi.list(id);
      setItems(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load tracking items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [id]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    setAdding(true);
    try {
      const created = await trackingApi.create(id, { item_name: newItem.trim(), status: 'packed' });
      setItems((prev) => [...prev, created]);
      setNewItem('');
    } catch (err) {
      setError(err.message || 'Failed to add item.');
    } finally {
      setAdding(false);
    }
  };

  const handleStatusChange = async (itemId, status) => {
    try {
      const updated = await trackingApi.update(itemId, { status });
      setItems((prev) => prev.map((item) => (item.id === itemId ? updated : item)));
    } catch (err) {
      setError(err.message || 'Failed to update status.');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await trackingApi.remove(itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      setError(err.message || 'Failed to remove item.');
    }
  };

  if (loading) return <LoadingState label="Loading tracking items..." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">Track your belongings</h1>
        <p className="text-sm text-[var(--color-slate)]">Add items to track their packing and delivery status.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-[var(--color-navy)]">Route map</h2>
          </CardHeader>
          <CardBody>
            <div className="h-[320px]">
              <RouteMapPicker />
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--color-slate)]">
              <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-[#0f9d92]" /> Pickup</span>
              <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-[#dc2626]" /> Destination</span>
              <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-[#102a43]" /> Route</span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-[var(--color-navy)]">Add item</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleAdd} className="flex flex-col gap-3">
              <Input
                placeholder="e.g. Living room boxes, Kitchenware..."
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                disabled={adding}
              />
              <Button type="submit" loading={adding} disabled={!newItem.trim()}>
                Add item
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>

      {error && (
        <Card>
          <CardBody className="text-sm text-[#dc2626]">{error}</CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-[var(--color-navy)]">Items ({items.length})</h2>
        </CardHeader>
        <CardBody>
          {items.length === 0 ? (
            <p className="text-sm text-[var(--color-slate)]">No items tracked yet. Add your first item above.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item) => {
                const statusMeta = STATUS_OPTIONS.find((s) => s.value === item.status) || STATUS_OPTIONS[0];
                const StatusIcon = statusMeta.icon;
                return (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] p-3">
                    <div className="flex items-center gap-3">
                      <StatusIcon className="size-5 text-[var(--color-slate)]" />
                      <div>
                        <p className="text-sm font-medium text-[var(--color-navy)]">{item.item_name}</p>
                        <p className="text-xs text-[var(--color-slate)]">Added {new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className="rounded-lg border border-[var(--color-border)] bg-white px-2 py-1 text-xs"
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <Button variant="ghost" size="sm" onClick={() => handleRemove(item.id)} className="text-[#dc2626]">
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

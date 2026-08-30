import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovers } from '../moversSlice';
import { Card, CardBody, Input, LoadingState, EmptyState, ErrorState } from '../../../components/ui';

export default function MoverList() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.movers);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchMovers());
  }, [dispatch]);

  const filtered = list.filter((m) => {
    const term = search.toLowerCase();
    return (m.name && m.name.toLowerCase().includes(term)) || (m.email && m.email.toLowerCase().includes(term));
  });

  if (loading) return <LoadingState label="Loading movers..." />;
  if (error) return <ErrorState onAction={() => dispatch(fetchMovers())} />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">Movers</h1>
        <p className="text-sm text-[var(--color-slate)]">Browse available movers.</p>
      </div>

      <Input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <EmptyState title="No movers found" description="Try adjusting your search." />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((m) => (
            <Card key={m.id}>
              <CardBody className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--color-navy)]">{m.name}</p>
                  <p className="text-xs text-[var(--color-slate)]">{m.email}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-[var(--color-slate)]">Rating: <span className="font-medium text-[var(--color-navy)]">{m.rating ?? '—'}</span></span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

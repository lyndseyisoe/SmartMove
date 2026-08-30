import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews, createReview, clearReviews } from '../../reviews/reviewsSlice';
import { Card, CardBody, CardHeader, Input, Select, Button, LoadingState, EmptyState } from '../../../components/ui';
import { Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const reviewSchema = z.object({
  moverId: z.string().min(1, 'Select a mover.'),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(1, 'Add a comment.'),
});

export default function Reviews() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.reviews);
  const [selectedMoverId, setSelectedMoverId] = useState('');

  useEffect(() => {
    dispatch(fetchReviews());
    return () => dispatch(clearReviews());
  }, [dispatch]);

  const filtered = selectedMoverId ? list.filter((r) => String(r.mover_id) === selectedMoverId) : list;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">Reviews</h1>
        <p className="text-sm text-[var(--color-slate)]">See and add reviews for movers.</p>
      </div>

      <AddReviewForm onSuccess={() => dispatch(fetchReviews())} />

      <Input
        placeholder="Filter by mover ID..."
        value={selectedMoverId}
        onChange={(e) => setSelectedMoverId(e.target.value)}
      />

      {loading ? (
        <LoadingState label="Loading reviews..." />
      ) : filtered.length === 0 ? (
        <EmptyState title="No reviews yet" description="Be the first to leave a review." />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((r) => (
            <Card key={r.id}>
              <CardBody className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--color-navy)]">Mover #{r.mover_id}</span>
                  <span className="flex items-center gap-1 text-sm text-[var(--color-slate)]">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" /> {r.rating}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-slate)]">{r.comment}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function AddReviewForm({ onSuccess }) {
  const dispatch = useDispatch();
  const { creating, createError } = useSelector((s) => s.reviews);
  const {
    register: field,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(reviewSchema) });

  const onSubmit = async (values) => {
    const result = await dispatch(createReview(values));
    if (createReview.fulfilled.match(result)) {
      reset();
      onSuccess();
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-[var(--color-navy)]">Add review</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {createError && <p className="text-sm text-[#dc2626]">{createError}</p>}
          <Input label="Mover ID" error={errors.moverId?.message} {...field('moverId')} />
          <Select label="Rating" error={errors.rating?.message} {...field('rating')}>
            <option value="">Select</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </Select>
          <Input label="Comment" error={errors.comment?.message} {...field('comment')} />
          <Button type="submit" loading={isSubmitting || creating} className="self-start">Submit review</Button>
        </form>
      </CardBody>
    </Card>
  );
}

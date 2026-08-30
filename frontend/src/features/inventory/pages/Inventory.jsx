import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventory, addInventoryItem, clearInventory } from '../../inventory/inventorySlice';
import { Card, CardBody, CardHeader, Input, Button, LoadingState, EmptyState } from '../../../components/ui';
import { useForm } from 'react-hook-form';

export default function Inventory() {
  const dispatch = useDispatch();
  const { list, loading, adding, addError } = useSelector((s) => s.inventory);

  useEffect(() => {
    dispatch(fetchInventory());
    return () => dispatch(clearInventory());
  }, [dispatch]);

  const {
    register: field,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    const result = await dispatch(addInventoryItem(values));
    if (addInventoryItem.fulfilled.match(result)) {
      reset();
    }
  };

  if (loading) return <LoadingState label="Loading inventory..." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">Inventory</h1>
        <p className="text-sm text-[var(--color-slate)]">Track items for your move.</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-[var(--color-navy)]">Add item</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {addError && <p className="text-sm text-[#dc2626]">{addError}</p>}
            <Input label="Item name" error={errors.itemName?.message} {...field('itemName')} />
            <Input label="Quantity" type="number" min="1" error={errors.quantity?.message} {...field('quantity')} />
            <Input label="Category" error={errors.category?.message} {...field('category')} />
            <Button type="submit" loading={isSubmitting || adding} className="self-start">Add item</Button>
          </form>
        </CardBody>
      </Card>

      {list.length === 0 ? (
        <EmptyState title="No items yet" description="Start tracking items by adding one above." />
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((item) => (
            <Card key={item.id}>
              <CardBody className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--color-navy)]">{item.item_name}</p>
                  <p className="text-xs text-[var(--color-slate)]">Category: {item.category}</p>
                </div>
                <span className="text-sm font-medium text-[var(--color-navy)]">x{item.quantity}</span>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

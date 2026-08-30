import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, sendMessage, clearMessages } from '../../messages/messagesSlice';
import { Card, CardBody, CardHeader, Input, Button, LoadingState, EmptyState } from '../../../components/ui';
import { useForm } from 'react-hook-form';

export default function Messages() {
  const dispatch = useDispatch();
  const { list, loading, sending, sendError } = useSelector((s) => s.messages);

  useEffect(() => {
    dispatch(fetchMessages());
    return () => dispatch(clearMessages());
  }, [dispatch]);

  const {
    register: field,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    const result = await dispatch(sendMessage(values));
    if (sendMessage.fulfilled.match(result)) {
      reset();
    }
  };

  if (loading) return <LoadingState label="Loading messages..." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">Messages</h1>
        <p className="text-sm text-[var(--color-slate)]">Communicate with your mover or support.</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-[var(--color-navy)]">Send message</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {sendError && <p className="text-sm text-[#dc2626]">{sendError}</p>}
            <Input label="Recipient ID" error={errors.recipientId?.message} {...field('recipient_id')} />
            <Input label="Message" error={errors.content?.message} {...field('content')} />
            <Button type="submit" loading={isSubmitting || sending} className="self-start">Send</Button>
          </form>
        </CardBody>
      </Card>

      {list.length === 0 ? (
        <EmptyState title="No messages yet" description="Start a conversation above." />
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((msg) => (
            <Card key={msg.id}>
              <CardBody className="flex flex-col gap-1">
                <p className="text-sm font-medium text-[var(--color-navy)]">To: {msg.recipient_id}</p>
                <p className="text-sm text-[var(--color-slate)]">{msg.content}</p>
                <p className="text-xs text-[var(--color-slate)]">{msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

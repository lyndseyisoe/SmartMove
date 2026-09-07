import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../../../components/ui';

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-[#fde8e8] text-[#dc2626]">
        <ShieldAlert className="size-7" />
      </div>
      <h1 className="text-xl font-bold text-[var(--color-navy)]">You don't have access to this page</h1>
      <p className="max-w-sm text-sm text-[var(--color-slate)]">
        Your account doesn't have permission to view this. If you think this is a mistake, contact support.
      </p>
      <Button as={Link} to="/login">Back to login</Button>
    </div>
  );
}

import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function SaveToggle({ onSave, label = 'Save changes', className }) {
  const [state, setState] = useState('idle'); // idle | saving | saved

  const handleClick = async () => {
    if (state === 'saving') return;
    setState('saving');
    try {
      await onSave?.();
      setState('saved');
      setTimeout(() => setState('idle'), 1800);
    } catch {
      setState('idle');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === 'saving'}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-all duration-200',
        state === 'saved' ? 'bg-[#15803d]' : 'gradient-primary',
        state === 'saving' && 'opacity-80',
        className
      )}
    >
      {state === 'saving' && <Loader2 className="size-4 animate-spin" />}
      {state === 'saved' && <Check className="size-4" />}
      {state === 'idle' && label}
      {state === 'saving' && 'Saving...'}
      {state === 'saved' && 'Saved'}
    </button>
  );
}

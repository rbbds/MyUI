import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cx } from '../../utils/cx';
import './Slideout.css';

export interface SlideoutProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Buttons, e.g. Annuleren + Toepassen. */
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  side?: 'right' | 'left';
  closeLabel?: string;
}

/**
 * Side panel on a native <dialog> (showModal): focus moves in and stays in,
 * Escape and the backdrop close it, and focus returns to the trigger.
 */
export function Slideout({ open, onClose, title, description, children, footer, size = 'md', side = 'right', closeLabel = 'Sluiten' }: SlideoutProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={cx('rb-slideout', `rb-slideout--${size}`, `rb-slideout--${side}`)}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      <div className="rb-slideout__panel">
        <div className="rb-slideout__header">
          <div className="rb-slideout__titles">
            <h2 id={titleId} className="rb-slideout__title">{title}</h2>
            {description && <p id={descId} className="rb-slideout__description">{description}</p>}
          </div>
          <button type="button" className="rb-slideout__close" onClick={onClose} aria-label={closeLabel}><X aria-hidden="true" /></button>
        </div>
        <div className="rb-slideout__body">{children}</div>
        {footer && <div className="rb-slideout__footer">{footer}</div>}
      </div>
    </dialog>
  );
}

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cx } from '../../utils/cx';
import './Overlay.css';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  /** E.g. <FeaturedIcon color="error" icon={<CircleAlert />} /> */
  icon?: ReactNode;
  children?: ReactNode;
  /** Footer actions, primary last. */
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeLabel?: string;
}

/** Built on the native <dialog>: focus trap, Escape and backdrop handling come from the browser. */
export function Modal({ open, onClose, title, description, icon, children, footer, size = 'md', closeLabel = 'Close' }: ModalProps) {
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
      className={cx('rb-modal', `rb-modal--${size}`)}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      <div className="rb-modal__panel">
        <div className="rb-modal__header">
          {icon}
          <div className="rb-modal__titles">
            <h2 id={titleId} className="rb-modal__title">{title}</h2>
            {description && <p id={descId} className="rb-modal__description">{description}</p>}
          </div>
          <button type="button" className="rb-modal__close" onClick={onClose} aria-label={closeLabel}><X aria-hidden="true" /></button>
        </div>
        {children && <div className="rb-modal__body">{children}</div>}
        {footer ? <div className="rb-modal__footer">{footer}</div> : <div style={{ height: 'var(--modal-padding)' }} />}
      </div>
    </dialog>
  );
}

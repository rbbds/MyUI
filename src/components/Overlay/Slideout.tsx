import { useId, type ReactNode, type RefObject } from 'react';
import { X } from 'lucide-react';
import { cx } from '../../utils/cx';
import { useModalDialog } from '../../utils/dialog';
import './Slideout.css';

export interface SlideoutProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Buttons, e.g. Cancel + Apply. */
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  side?: 'right' | 'left';
  closeLabel?: string;
  /** Element that gets focus when the slideout opens. Default: the close button. */
  initialFocus?: RefObject<HTMLElement | null>;
}

/**
 * Side panel on a native <dialog> (showModal): focus moves in and stays in,
 * Escape and the backdrop close it, and focus returns to the trigger. The page behind does not scroll.
 */
export function Slideout({ open, onClose, title, description, children, footer, size = 'md', side = 'right', closeLabel = 'Close', initialFocus }: SlideoutProps) {
  const dialog = useModalDialog({ open, onClose, initialFocus });
  const titleId = useId();
  const descId = useId();
  return (
    <dialog
      {...dialog}
      className={cx('rb-slideout', `rb-slideout--${size}`, `rb-slideout--${side}`)}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
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

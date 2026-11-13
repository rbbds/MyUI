import { useId, type ReactNode, type RefObject } from 'react';
import { X } from 'lucide-react';
import { cx } from '../../utils/cx';
import { useModalDialog } from '../../utils/dialog';
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
  /** Element that gets focus when the modal opens, e.g. the first field of a form. Default: the close button. */
  initialFocus?: RefObject<HTMLElement | null>;
}

/**
 * Built on the native <dialog>: focus trap, Escape and focus back to the trigger come from the browser.
 * The backdrop closes it (only when the press starts there), the page behind does not scroll,
 * and onClose also runs when a <form method="dialog"> inside closes it.
 */
export function Modal({ open, onClose, title, description, icon, children, footer, size = 'md', closeLabel = 'Close', initialFocus }: ModalProps) {
  const dialog = useModalDialog({ open, onClose, initialFocus });
  const titleId = useId();
  const descId = useId();
  return (
    <dialog
      {...dialog}
      className={cx('rb-modal', `rb-modal--${size}`)}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
    >
      <div className={cx('rb-modal__panel', !footer && 'rb-modal__panel--no-footer')}>
        <div className="rb-modal__header">
          {icon}
          <div className="rb-modal__titles">
            <h2 id={titleId} className="rb-modal__title">{title}</h2>
            {description && <p id={descId} className="rb-modal__description">{description}</p>}
          </div>
          <button type="button" className="rb-modal__close" onClick={onClose} aria-label={closeLabel}><X aria-hidden="true" /></button>
        </div>
        {children && <div className="rb-modal__body">{children}</div>}
        {footer && <div className="rb-modal__footer">{footer}</div>}
      </div>
    </dialog>
  );
}

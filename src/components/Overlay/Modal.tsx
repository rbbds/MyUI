import { forwardRef, useId, useMemo, type DialogHTMLAttributes, type ReactNode, type RefObject } from 'react';
import { CloseButton } from '../Button/CloseButton';
import { cx } from '../../utils/cx';
import { useModalDialog } from '../../utils/dialog';
import { mergeLabels } from '../../utils/labels';
import { mergeRefs } from '../../utils/refs';
import type { HeadingLevel } from '../../utils/useControlled';
import './Overlay.css';

export interface ModalLabels {
  /** Name of the close button. */
  close: string;
}
export const DEFAULT_MODAL_LABELS: ModalLabels = { close: 'Close' };

export interface ModalProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'title' | 'open' | 'onClose'> {
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
  /** Level of the title. Default 2: a dialog is its own context. */
  headingLevel?: HeadingLevel;
  labels?: Partial<ModalLabels>;
  /** @deprecated Use labels.close. Removed in 2.0.0. */
  closeLabel?: string;
  /** Element that gets focus when the modal opens, e.g. the first field of a form. Default: the close button. */
  initialFocus?: RefObject<HTMLElement | null>;
}

/**
 * Built on the native <dialog>: focus trap, Escape and focus back to the trigger come from the browser.
 * The backdrop closes it (only when the press starts there), the page behind does not scroll,
 * and onClose also runs when a <form method="dialog"> inside closes it.
 */
export const Modal = forwardRef<HTMLDialogElement, ModalProps>(function Modal({ open, onClose, title, description, icon, children, footer, size = 'md', headingLevel = 2, labels, closeLabel, initialFocus, className, ...rest }, ref) {
  const l = mergeLabels(DEFAULT_MODAL_LABELS, labels, { close: closeLabel });
  const H = `h${headingLevel}` as 'h2';
  const dialog = useModalDialog({ open, onClose, initialFocus });
  const dialogRef = useMemo(() => mergeRefs(dialog.ref, ref), [dialog.ref, ref]);
  const titleId = useId();
  const descId = useId();
  return (
    <dialog
      {...rest}
      {...dialog}
      ref={dialogRef}
      className={cx('rb-modal', `rb-modal--${size}`, className)}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
    >
      <div className={cx('rb-modal__panel', !footer && 'rb-modal__panel--no-footer')}>
        <div className="rb-modal__header">
          {icon}
          <div className="rb-modal__titles">
            <H id={titleId} className="rb-modal__title">{title}</H>
            {description && <p id={descId} className="rb-modal__description">{description}</p>}
          </div>
          <CloseButton size="md" className="rb-modal__close" onClick={onClose} aria-label={l.close} />
        </div>
        {children && <div className="rb-modal__body">{children}</div>}
        {footer && <div className="rb-modal__footer">{footer}</div>}
      </div>
    </dialog>
  );
});

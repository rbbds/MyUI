import { forwardRef, useId, useMemo, type DialogHTMLAttributes, type ReactNode, type RefObject } from 'react';
import { CloseButton } from '../Button/CloseButton';
import { cx } from '../../utils/cx';
import { useModalDialog } from '../../utils/dialog';
import { useLabels } from '../../utils/locale';
import { mergeRefs } from '../../utils/refs';
import type { HeadingLevel } from '../../utils/useControlled';
import './Slideout.css';

export interface SlideoutLabels {
  /** Name of the close button. */
  close: string;
}
export const DEFAULT_SLIDEOUT_LABELS: SlideoutLabels = { close: 'Close' };

export interface SlideoutProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'title' | 'open' | 'onClose'> {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Buttons, e.g. Cancel + Apply. */
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  side?: 'right' | 'left';
  /** Level of the title. Default 2: a dialog is its own context. */
  headingLevel?: HeadingLevel;
  labels?: Partial<SlideoutLabels>;
  /** @deprecated Use labels.close. Removed in 2.0.0. */
  closeLabel?: string;
  /** Element that gets focus when the slideout opens. Default: the close button. */
  initialFocus?: RefObject<HTMLElement | null>;
}

/**
 * Side panel on a native <dialog> (showModal): focus moves in and stays in,
 * Escape and the backdrop close it, and focus returns to the trigger. The page behind does not scroll.
 */
export const Slideout = forwardRef<HTMLDialogElement, SlideoutProps>(function Slideout({ open, onClose, title, description, children, footer, size = 'md', side = 'right', headingLevel = 2, labels, closeLabel, initialFocus, className, ...rest }, ref) {
  const l = useLabels('slideout', DEFAULT_SLIDEOUT_LABELS, labels, { close: closeLabel });
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
      className={cx('rb-slideout', `rb-slideout--${size}`, `rb-slideout--${side}`, className)}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
    >
      <div className="rb-slideout__panel">
        <div className="rb-slideout__header">
          <div className="rb-slideout__titles">
            <H id={titleId} className="rb-slideout__title">{title}</H>
            {description && <p id={descId} className="rb-slideout__description">{description}</p>}
          </div>
          <CloseButton size="md" className="rb-slideout__close" onClick={onClose} aria-label={l.close} />
        </div>
        <div className="rb-slideout__body">{children}</div>
        {footer && <div className="rb-slideout__footer">{footer}</div>}
      </div>
    </dialog>
  );
});

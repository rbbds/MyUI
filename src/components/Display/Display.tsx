import { cloneElement, isValidElement, useId, useRef, useState, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { User, X } from 'lucide-react';
import { cx } from '../../utils/cx';
import { useEscape, usePlacement } from '../../utils/panel';
import './Display.css';

export type StatusColor = 'gray' | 'brand' | 'error' | 'warning' | 'success' | 'info';

/* ---------- Badge ---------- */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: StatusColor;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  iconLeading?: ReactNode;
  iconTrailing?: ReactNode;
}
/** Non-interactive status label. Text must state the status too: never rely on color alone. */
export function Badge({ color = 'gray', size = 'md', dot, iconLeading, iconTrailing, className, children, ...rest }: BadgeProps) {
  return (
    <span className={cx('rb-badge', `rb-badge--${color}`, `rb-badge--${size}`, className)} {...rest}>
      {dot && <span className="rb-badge__dot" aria-hidden="true" />}
      {iconLeading}
      {children}
      {iconTrailing}
    </span>
  );
}

/* ---------- Tag ---------- */
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  /** Renders a close button. Its accessible name is "Remove {label}" unless removeLabel is set. */
  onRemove?: () => void;
  removeLabel?: string;
  labels?: Partial<TagLabels>;
}
export interface TagLabels { remove: (label: string) => string }
export const DEFAULT_TAG_LABELS: TagLabels = { remove: (label) => `Remove ${label}`.trim() };
export function Tag({ size = 'md', dot, onRemove, removeLabel, labels, className, children, ...rest }: TagProps) {
  const l = { ...DEFAULT_TAG_LABELS, ...labels };
  return (
    <span className={cx('rb-tag', `rb-tag--${size}`, className)} {...rest}>
      {dot && <span className="rb-tag__dot" aria-hidden="true" />}
      {children}
      {onRemove && (
        <button type="button" className="rb-tag__close" onClick={onRemove} aria-label={removeLabel ?? l.remove(typeof children === 'string' ? children : '')}>
          <X aria-hidden="true" />
        </button>
      )}
    </span>
  );
}

/* ---------- Avatar ---------- */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export interface AvatarLabels { online: string; offline: string }
export const DEFAULT_AVATAR_LABELS: AvatarLabels = { online: 'Online', offline: 'Offline' };
export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  size?: AvatarSize;
  src?: string;
  /** Person's name: used for alt text and to derive initials. */
  name?: string;
  initials?: string;
  status?: 'online' | 'offline';
  labels?: Partial<AvatarLabels>;
}
function toInitials(name?: string) {
  if (!name) return '';
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? '') + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
}
export function Avatar({ size = 'md', src, name, initials, status, labels, className, ...rest }: AvatarProps) {
  const l = { ...DEFAULT_AVATAR_LABELS, ...labels };
  const [failed, setFailed] = useState(false);
  const text = initials ?? toInitials(name);
  return (
    <span className={cx('rb-avatar', `rb-avatar--${size}`, className)} {...rest}>
      <span className="rb-avatar__inner" role={(!src || failed) && name ? 'img' : undefined} aria-label={(!src || failed) && name ? name : undefined}>
        {src && !failed ? <img src={src} alt={name ?? ''} onError={() => setFailed(true)} /> : text ? <span aria-hidden="true">{text}</span> : <User aria-hidden="true" />}
      </span>
      {status && <span className={cx('rb-avatar__status', status === 'offline' && 'rb-avatar__status--offline')} aria-label={status === 'online' ? l.online : l.offline} role="img" />}
    </span>
  );
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md';
  /** Max avatars before the "+n" counter. */
  max?: number;
  children: ReactNode;
  labels?: Partial<AvatarGroupLabels>;
}
export interface AvatarGroupLabels { more: (count: number) => string }
export const DEFAULT_AVATAR_GROUP_LABELS: AvatarGroupLabels = { more: (count) => `${count} ${count === 1 ? 'other' : 'others'}` };
export function AvatarGroup({ size = 'sm', max = 4, labels, className, children, ...rest }: AvatarGroupProps) {
  const l = { ...DEFAULT_AVATAR_GROUP_LABELS, ...labels };
  const items = (Array.isArray(children) ? children : [children]).filter(isValidElement) as ReactElement<AvatarProps>[];
  const shown = items.slice(0, max);
  const extra = items.length - shown.length;
  return (
    <div className={cx('rb-avatar-group', `rb-avatar-group--${size}`, className)} {...rest}>
      {shown.map((el, i) => cloneElement(el, { key: i, size }))}
      {extra > 0 && <Avatar size={size} initials={`+${extra}`} name={l.more(extra)} />}
    </div>
  );
}

/* ---------- Divider ---------- */
export interface DividerProps extends HTMLAttributes<HTMLElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: ReactNode;
}
export function Divider({ orientation = 'horizontal', label, className, ...rest }: DividerProps) {
  /* No role="separator" here: a separator hides its text from screen readers, and the label must be read. */
  if (label) return <div className={cx('rb-divider-label', className)} {...rest}>{label}</div>;
  return orientation === 'vertical'
    ? <div role="separator" aria-orientation="vertical" className={cx('rb-divider', 'rb-divider--vertical', className)} {...rest} />
    : <hr className={cx('rb-divider', className)} {...rest} />;
}

/* ---------- Featured icon ---------- */
export interface FeaturedIconProps extends HTMLAttributes<HTMLSpanElement> {
  color?: StatusColor;
  size?: 'sm' | 'md' | 'lg';
  icon: ReactNode;
}
/** Decorative icon in a tinted circle. aria-hidden by default. */
export function FeaturedIcon({ color = 'brand', size = 'md', icon, className, ...rest }: FeaturedIconProps) {
  return <span data-size={size} className={cx('rb-featured-icon', `rb-featured-icon--${color}`, `rb-featured-icon--${size}`, className)} aria-hidden="true" {...rest}>{icon}</span>;
}

/* ---------- Spinner ---------- */
export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
  /** Visually hidden status text. */
  label?: string;
}
export function Spinner({ size = 'md', label = 'Loading', className, ...rest }: SpinnerProps) {
  return (
    <span role="status" className={className} {...rest}>
      <span className={cx('rb-spinner', `rb-spinner--${size}`)} aria-hidden="true" />
      <span className="rb-visually-hidden">{label}</span>
    </span>
  );
}

/* ---------- Progress bar ---------- */
export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  /** Accessible name, e.g. "Upload progress". */
  label: string;
  valuePosition?: 'none' | 'right' | 'bottom';
}
export function ProgressBar({ value, max = 100, label, valuePosition = 'right', className, ...rest }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cx('rb-progress', valuePosition === 'bottom' && 'rb-progress--bottom', className)} {...rest}>
      <div className="rb-progress__track" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        <div className="rb-progress__indicator" style={{ width: `${pct}%` }} />
      </div>
      {valuePosition !== 'none' && <span className="rb-progress__value" aria-hidden="true">{Math.round(pct)}%</span>}
    </div>
  );
}

/* ---------- Tooltip ---------- */
export interface TooltipProps {
  title: ReactNode;
  text?: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** A single focusable element (e.g. ButtonIcon). */
  children: ReactElement<{ 'aria-describedby'?: string }>;
}
/**
 * Shows on hover and keyboard focus. Escape hides it wherever the focus is, and the pointer can move
 * onto the tooltip without hiding it (WCAG 1.4.13). Not for essential or interactive content.
 */
export function Tooltip({ title, text, placement = 'top', children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = `rb-tt-${useId()}`;
  const root = useRef<HTMLSpanElement>(null);
  const tip = useRef<HTMLSpanElement>(null);
  useEscape({ open, root, anyTarget: true, onEscape: () => setOpen(false) });
  // In the top layer, so a Modal or a table cannot clip it. It moves to the other side when there is no room.
  const { side } = usePlacement({ open, panel: tip, anchor: root, side: placement, align: 'center' });
  return (
    <span
      ref={root}
      className="rb-tooltip-anchor"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {cloneElement(children, { 'aria-describedby': id })}
      <span ref={tip} id={id} role="tooltip" className={cx('rb-tooltip', `rb-tooltip--${open ? side : placement}`)} data-open={open}>
        <span className="rb-tooltip__title">{title}</span>
        {text && <span className="rb-tooltip__text">{text}</span>}
      </span>
    </span>
  );
}

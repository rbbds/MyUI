import { cloneElement, isValidElement, useId, useState, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { User, X } from 'lucide-react';
import { cx } from '../../utils/cx';
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
}
export function Tag({ size = 'md', dot, onRemove, removeLabel, className, children, ...rest }: TagProps) {
  return (
    <span className={cx('rb-tag', `rb-tag--${size}`, className)} {...rest}>
      {dot && <span className="rb-tag__dot" aria-hidden="true" />}
      {children}
      {onRemove && (
        <button type="button" className="rb-tag__close" onClick={onRemove} aria-label={removeLabel ?? `Remove ${typeof children === 'string' ? children : ''}`.trim()}>
          <X aria-hidden="true" />
        </button>
      )}
    </span>
  );
}

/* ---------- Avatar ---------- */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  size?: AvatarSize;
  src?: string;
  /** Person's name: used for alt text and to derive initials. */
  name?: string;
  initials?: string;
  status?: 'online' | 'offline';
}
function toInitials(name?: string) {
  if (!name) return '';
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? '') + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
}
export function Avatar({ size = 'md', src, name, initials, status, className, ...rest }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const text = initials ?? toInitials(name);
  return (
    <span className={cx('rb-avatar', `rb-avatar--${size}`, className)} {...rest}>
      <span className="rb-avatar__inner" role={!src || failed ? 'img' : undefined} aria-label={!src || failed ? name : undefined}>
        {src && !failed ? <img src={src} alt={name ?? ''} onError={() => setFailed(true)} /> : text ? <span aria-hidden="true">{text}</span> : <User aria-hidden="true" />}
      </span>
      {status && <span className={cx('rb-avatar__status', status === 'offline' && 'rb-avatar__status--offline')} aria-label={status === 'online' ? 'Online' : 'Offline'} role="img" />}
    </span>
  );
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md';
  /** Max avatars before the "+n" counter. */
  max?: number;
  children: ReactNode;
}
export function AvatarGroup({ size = 'sm', max = 4, className, children, ...rest }: AvatarGroupProps) {
  const items = (Array.isArray(children) ? children : [children]).filter(isValidElement) as ReactElement<AvatarProps>[];
  const shown = items.slice(0, max);
  const extra = items.length - shown.length;
  return (
    <div className={cx('rb-avatar-group', `rb-avatar-group--${size}`, className)} {...rest}>
      {shown.map((el, i) => cloneElement(el, { key: i, size }))}
      {extra > 0 && <Avatar size={size} initials={`+${extra}`} name={`${extra} others`} />}
    </div>
  );
}

/* ---------- Divider ---------- */
export interface DividerProps extends HTMLAttributes<HTMLElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: ReactNode;
}
export function Divider({ orientation = 'horizontal', label, className, ...rest }: DividerProps) {
  if (label) return <div role="separator" className={cx('rb-divider-label', className)} {...rest}>{label}</div>;
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
/** Shows on hover and keyboard focus, hides on Escape. Not for essential or interactive content. */
export function Tooltip({ title, text, placement = 'top', children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = `rb-tt-${useId()}`;
  return (
    <span
      className="rb-tooltip-anchor"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
    >
      {cloneElement(children, { 'aria-describedby': id })}
      <span id={id} role="tooltip" className={cx('rb-tooltip', `rb-tooltip--${placement}`)} data-open={open}>
        <span className="rb-tooltip__title">{title}</span>
        {text && <span className="rb-tooltip__text">{text}</span>}
      </span>
    </span>
  );
}

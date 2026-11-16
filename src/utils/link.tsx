import { createContext, forwardRef, useContext, type AnchorHTMLAttributes, type ComponentType, type ReactNode, type Ref } from 'react';

/** Props a router link gets from MyUI: the usual anchor attributes, with `href` always set. */
export type LinkComponentProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; ref?: Ref<HTMLAnchorElement> };
/** A router link, e.g. Next.js `Link`. For React Router, map `href` to `to`. */
export type LinkComponent = ComponentType<LinkComponentProps>;

const LinkContext = createContext<LinkComponent | null>(null);

export interface LinkProviderProps {
  /** The link of your router. Without a provider MyUI renders a plain `<a href>`. */
  component: LinkComponent;
  children?: ReactNode;
}

/**
 * Lets every MyUI link (NavItem, Header, Mega menu, Breadcrumbs, Card, …) use the link of your router,
 * so navigation does not reload the page (M20).
 *
 * ```tsx
 * import NextLink from 'next/link';
 * <LinkProvider component={NextLink}>…</LinkProvider>
 *
 * import { Link as RouterLink } from 'react-router';
 * <LinkProvider component={({ href, ...p }) => <RouterLink to={href} {...p} />}>…</LinkProvider>
 * ```
 */
export function LinkProvider({ component, children }: LinkProviderProps) {
  return <LinkContext.Provider value={component}>{children}</LinkContext.Provider>;
}

/** Internal: an anchor that uses the LinkProvider component when there is one. Downloads and links without href stay a plain `<a>`. */
export const Link = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function Link(props, ref) {
  const C = useContext(LinkContext);
  if (C && props.href && props.download === undefined) return <C {...props} href={props.href} ref={ref} />;
  return <a ref={ref} {...props} />;
});

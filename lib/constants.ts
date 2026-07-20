
// export const NAV_LINKS = [
//   { to: "/", label: "Home" },
//   { to: "/shop", label: "Shop" },
//   { to: "/about", label: "About" },
//   { to: "/reviews", label: "Reviews" },
//   { to: "/faqs", label: "FAQs" },
//   { to: "/contact", label: "Contact" },
// ] as const;
export interface MenuItem {
  label: string;
  href: string;
  external?: boolean;
  adminOnly?: boolean;
  isNew?: boolean;
}

export const menuItems: MenuItem[] = [
  { label: "Home", href: "/", adminOnly: false },
  { label: "Shop", href: "/shop", adminOnly: false },
  { label: "About", href: "/about", adminOnly: false },
  { label: "Reviews", href: "/reviews", adminOnly: false },
  { label: "FAQs", href: "/faqs", adminOnly: false },
  { label: "Contact", href: "/contact", adminOnly: false },
];
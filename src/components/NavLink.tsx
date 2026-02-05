"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ShoppingBasketIcon } from "lucide-react";

const icons = {
  ShoppingBasketIcon,
} as const;

type IconName = keyof typeof icons; // "ShoppingBasketIcon"

interface NavLinkProps {
  label: string;
  href: string;
  iconName?: IconName; // matches keys in icons
}

export const NavLink: React.FC<NavLinkProps> = ({ label, href, iconName }) => {
  const Icon = iconName ? icons[iconName] : () => <span />;
  const pathName = usePathname();
  const isActive = pathName === href || pathName.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 nav-link ${isActive ? "nav-link-active" : ""}`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
};

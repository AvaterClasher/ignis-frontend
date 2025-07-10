import { HomeIcon } from 'lucide-react';
import Link from 'next/link';

const NAVBAR_ITEMS = [
  {
    icon: <HomeIcon />,
    label: 'Home',
    href: '/',
  },
];

export function Navbar() {
  return (
    <div className="flex items-center gap-2 bg-background">
      {NAVBAR_ITEMS.map((item) => (
        <Link
          className="flex items-center gap-2"
          href={item.href}
          key={item.href}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </div>
  );
}

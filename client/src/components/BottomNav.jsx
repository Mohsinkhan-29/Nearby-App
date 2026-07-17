import { Compass, LayoutGrid, Bookmark, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const TABS = [
  { key: "discover", label: "Discover", icon: Compass, to: "/discover" },
  { key: "saved", label: "Saved", icon: Bookmark, to: "/saved" },
  { key: "profile", label: "Profile", icon: User, to: "/profile" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-md items-center justify-around border-t border-sand bg-paper px-2 py-3">
      {TABS.map(({ key, label, icon: Icon, to }) => {
        const isActive = location.pathname === to;
        return (
          <Link
            key={key}
            to={to}
            className="flex flex-col items-center gap-1 px-3 text-xs"
          >
            <Icon
              size={22}
              strokeWidth={2}
              className={isActive ? "text-night" : "text-ink/35"}
              fill={isActive ? "currentColor" : "none"}
            />
            <span className={isActive ? "font-medium text-night" : "text-ink/40"}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import BottomNav from "../components/BottomNav.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const MENU_ITEMS = [
  { icon: Bookmark, label: "Saved Places", to: "/saved" },
  { icon: Bell, label: "Notifications", to: "/profile" },
  { icon: Settings, label: "Settings", to: "/profile" },
  { icon: HelpCircle, label: "Help & Support", to: "/profile" },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") ||
    "https://picsum.photos/seed/avatar/160/160"
  );

  useEffect(() => {
    const saved = localStorage.getItem("profileImage");
    if (saved) setProfileImage(saved);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result);
      localStorage.setItem("profileImage", reader.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="mx-auto max-w-md pb-28">
      <div className="flex items-center gap-3 px-5 pt-6">
        <button onClick={() => navigate(-1)} className="text-ink">
          <ChevronLeft size={22} />
        </button>
        <h1 className="font-display text-2xl text-ink">Profile</h1>
      </div>

      <div className="mt-5 flex flex-col items-center px-5">
        <div className="relative">
          <button
            onClick={() => fileInputRef.current.click()}
            className="group relative h-20 w-20 overflow-hidden rounded-full"
          >
            <img
              src={profileImage}
              alt="Profile"
              className="h-full w-full object-cover transition group-hover:brightness-75"
            />

            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
              <span className="text-xs font-medium text-white">
                Edit
              </span>
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <h2 className="mt-3 font-display text-xl text-ink">
          {user?.name || "Guest"}
        </h2>
        <p className="text-sm text-ink/50">{user?.email}</p>
      </div>

      <div className="mt-6 flex flex-col gap-2 px-5">
        {MENU_ITEMS.map(({ icon: Icon, label, to }) => (
          <button
            key={label}
            onClick={() => navigate(to)}
            className="flex items-center justify-between rounded-2xl bg-mist px-4 py-3.5"
          >
            <span className="flex items-center gap-3 text-sm font-medium text-ink">
              <Icon size={16} className="text-ink/50" />
              {label}
            </span>
            <ChevronRight size={16} className="text-ink/30" />
          </button>
        ))}

        <button
          onClick={logout}
          className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-clay/10 py-3.5 text-sm font-semibold text-clay"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
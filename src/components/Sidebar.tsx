import { NavLink } from "react-router-dom";
import { Home, User, Info, LogOut } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="bg-white h-full rounded-2xl shadow p-4 flex flex-col items-center">
      {/* Avatar */}
      <div className="text-center mb-12">
        <img
          src="https://i.pravatar.cc/100?img=3"
          className="w-16 h-16 rounded-full mx-auto mb-2"
        />
        <p className="font-semibold text-black">ROWLET</p>
      </div>

      {/* Menu */}
      <div className="w-full text-left px-2">
        <nav className="space-y-4">
          <SidebarLink to="/" icon={<Home size={18} />} label="Home" />
          <SidebarLink
            to="/profile"
            icon={<User size={18} />}
            label="Profile"
          />
          <SidebarLink to="/faq" icon={<Info size={18} />} label="FAQ's" />
          <SidebarLink
            to="/logout"
            icon={<LogOut size={18} />}
            label="Logout"
          />
        </nav>
      </div>
    </div>
  );
}

function SidebarLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-2 px-2 py-1 rounded-md transition ${
          isActive
            ? "text-blue-500 font-semibold"
            : "text-gray-600 hover:text-blue-400"
        }`
      }
    >
      <div>{icon}</div>
      <span>{label}</span>
    </NavLink>
  );
}

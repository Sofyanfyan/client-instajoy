import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  PlusSquare,
  Heart,
  User,
  LogOut,
  Instagram,
} from "lucide-react";
import { cn } from "../lib/utils";
import { usePost } from "../contexts/PostContext";
import { useAuth } from "../contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Sidebar = () => {
  const location = useLocation();
  const { getUnreadNotificationsCount } = usePost();
  const { user, logout } = useAuth();
  const unreadCount = getUnreadNotificationsCount();

  const navItems = [
    { path: "/", icon: Home, label: "Beranda" },
    { path: "/explore", icon: Search, label: "Jelajahi" },
    { path: "/create", icon: PlusSquare, label: "Buat Post" },
    {
      path: "/notifications",
      icon: Heart,
      label: "Notifikasi",
      badge: unreadCount,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-card border-r border-border fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-instagram flex items-center justify-center">
            <Instagram className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold gradient-instagram-text">
            instaJoy
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-secondary text-foreground font-semibold"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
              )}>
              <div className="relative">
                <item.icon
                  className="w-6 h-6"
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.avatar} alt={user?.username} />
            <AvatarFallback>
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{user?.username}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.fullName}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
            title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

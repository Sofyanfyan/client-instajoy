import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import { Instagram } from "lucide-react";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border flex items-center justify-center z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-instagram flex items-center justify-center">
            <Instagram className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold gradient-instagram-text">
            instaJoy
          </span>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="md:ml-64 pt-14 md:pt-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default MainLayout;

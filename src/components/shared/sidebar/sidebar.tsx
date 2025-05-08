import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import React from "react";

interface SidebarProps {
  children: React.ReactNode;
}

export const Sidebar = ({ children }: SidebarProps) => {
  const { isOpen } = useSidebar();
  return (
    <div
      className={cn(
        "fixed top-0 left-0 w-64 h-screen transition-all duration-900 ease-in-out",
        isOpen ? "w-64 bg-blue-400 border-r border-green-700" : "w-0"
      )}
    >
      {children}
    </div>
  );
};
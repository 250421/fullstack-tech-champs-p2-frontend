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
        "fixed top-0 left-0 h-screen bg-background transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? "w-64 border-r" : "w-0"
      )}
    >
      <div className={cn(
        "flex flex-col h-full w-64", // Fixed width matching expanded state
        !isOpen && "opacity-0 transition-opacity duration-200"
      )}>
        {/* Logo and Title Section */}
        <div className="p-4 border-b h-16 flex items-center bg-green-400">
          <div className="flex items-center gap-2">
            {/* Logo - replace with your actual logo component */}
            <div className="size-8 bg-primary rounded flex items-center justify-center shrink-0">
              <span className="text-white font-bold">F</span>
            </div>
            
            {/* Title */}
            <h1 className="text-xl font-bold whitespace-nowrap">NFL Fantasy</h1>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto bg-gray-800 pt-5">
          {children}
        </div>
      </div>
    </div>
  );
};
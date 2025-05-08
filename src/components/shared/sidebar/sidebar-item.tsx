import { Button } from "@/components/ui/button";
import{Link} from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";


interface SidebarItemProps {
  label: string;
  icon: LucideIcon;
  href: string;
}

export const SidebarItem = ({ label, icon: Icon, href }: SidebarItemProps) => {
  return (
    <div>
        <Button className="w-full flex justify-start text-base" variant={"ghost"} asChild>
          <Link to={href}>
            <Icon className="size-6 mr-2"></Icon>
            {label}
          </Link>
        </Button>
    </div>
  );
};
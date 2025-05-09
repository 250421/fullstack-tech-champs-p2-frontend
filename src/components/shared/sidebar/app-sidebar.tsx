import { CreditCardIcon, Home,View} from "lucide-react";
import { Sidebar } from "./sidebar";
import { SidebarContent } from "./sidebar-content";
import { SidebarGroup } from "./sidebar-group";
import { SidebarItem } from "./sidebar-item";


export const AppSidebar = () => {

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
        <SidebarItem label={"Dashboard"} icon={Home} href={"/"}  />
          <SidebarItem label={"Create Team"} icon={CreditCardIcon} href={"/create-team"} />
          <SidebarItem label={"My Team"} icon={CreditCardIcon} href={"/my-team-page"} />
          <SidebarItem label={"Players"} icon={View} href={"/player"} />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
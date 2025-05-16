
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { UserProfile } from './userProfile'
import { useSuccessLogout } from "@/hooks/useDialogLogout"
import { useLogout } from "@/hooks/useLogout"
export const UserDropdown = () => {
  const [logoutConfirm,LogoutDialog] = useSuccessLogout();
  
  const {mutate: logout} =useLogout();
  

  const handleLogout = async () =>{
    const ok = await logoutConfirm();
    if(!ok) return;
    logout();
  }

  return (
    <div>
      <DropdownMenu>
          <DropdownMenuTrigger><UserProfile/></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
      </DropdownMenu>
      <LogoutDialog title={"Logout"} description={"Are you sure you want to Logout"} destructive={true}/>

    </div>
  )
}

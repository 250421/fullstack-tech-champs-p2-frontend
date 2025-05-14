import { Badge } from "@/components/ui/badge";
import { useAuth } from "../hook/useAuth";

export const UserProfile = () => {
  const { data: user } = useAuth();
  return (
    <Badge variant="secondary" className="px-5 py-1 text-sm font-semibold bg-green-400 text-black">
      {user?.username ?? "No username available"}
    </Badge>
  );
};

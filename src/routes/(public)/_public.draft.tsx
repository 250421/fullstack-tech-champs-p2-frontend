
import { useState } from "react";

// Routing
import { createFileRoute } from '@tanstack/react-router'

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample player data
const playerData = [
  { position: "RB", name: "Sequan Barkley", team: "Eagles" },
  { position: "QB", name: "Dak Prescott", team: "Cowboys" },
  { position: "WR", name: "Tyreek Hill", team: "Dolphins" },
];

export const Route = createFileRoute('/(public)/_public/draft')({
  component: RouteComponent,
})

function RouteComponent() {

    const [searchQuery, setSearchQuery] = useState("");
    const [positionFilter, setPositionFilter] = useState("All");

    const handlePickPlayer = (playerName:any) => {
        console.log(`Picked player: ${playerName}`);
        // Here you would implement the logic to handle player selection
    };

  return (
    <div className="w-full h-full p-6">
      <h1 className="text-2xl font-bold mb-8">Player Draft Page</h1>
      
      <div className="max-w-4xl">
        {/* Current Pick Info */}
        <div className="flex items-center border-b pb-4 mb-4">
          <div className="flex items-center mr-6">
            <div>
              <div className="text-sm">Pick</div>
              <div className="font-bold text-lg">6th</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full border flex items-center justify-center mr-2">
              {/* Team icon placeholder */}
            </div>
            <div>
              <div className="font-medium">Still picking...</div>
              <div className="text-sm">Cowboys</div>
            </div>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="flex items-center gap-2 border-b pb-4 mb-4">
          <div className="flex items-center">
            <Search size={20} className="mr-2" />
          </div>
          <Input
            className="flex-grow max-w-xs"
            placeholder="Search by name or team"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="QB">QB</SelectItem>
              <SelectItem value="RB">RB</SelectItem>
              <SelectItem value="WR">WR</SelectItem>
              <SelectItem value="TE">TE</SelectItem>
              <SelectItem value="K">K</SelectItem>
              <SelectItem value="DEF">DEF</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Player List */}
        <div>
          {/* Header */}
          <div className="grid grid-cols-12 border-b py-2">
            <div className="col-span-2 font-bold">Position</div>
            <div className="col-span-8 font-bold">Player</div>
            <div className="col-span-2"></div>
          </div>
          
          {/* Player Rows */}
          {playerData.map((player, index) => (
            <div key={index} className="grid grid-cols-12 border-b py-3 items-center">
              <div className="col-span-2 text-gray-600">{player.position}</div>
              <div className="col-span-8">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full border flex items-center justify-center mr-2">
                    {/* Player icon placeholder */}
                  </div>
                  <div>
                    <div className="font-medium">{player.name}</div>
                    <div className="text-sm text-gray-600">{player.team}</div>
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <Button
                  className="bg-yellow-200 hover:bg-yellow-300 text-black px-4 py-1 h-8 rounded-md"
                  onClick={() => handlePickPlayer(player.name)}
                >
                  Pick
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

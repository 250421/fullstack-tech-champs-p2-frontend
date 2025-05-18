import { useEffect, useState, Fragment } from "react";

// Routing
import { createFileRoute } from '@tanstack/react-router';

// Hooks

import { useGetLeagueById } from "@/hooks/useGetLeagueById";
import { getDraftPick } from "@/utils/draftPickActions";
import { getTeamById } from "@/utils/teamActions";


// Components
import TableRow from "@/components/DraftTable/TableRow";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/features/auth/hook/useAuth";

// Sample player data
const playerData = [
  { position: "RB", name: "Sequan Barkley", drafted: false, fantasyPoints: 5.0, playerApiId: 23422 },
  { position: "QB", name: "Dak Prescott",  drafted: false, fantasyPoints: 3.0, playerApiId: 24961 },
  { position: "WR", name: "Tyreek Hill",  drafted: false, fantasyPoints: 7.0, playerApiId: 23841 },
];



export const Route = createFileRoute('/(auth)/_auth/draft')({
  component: RouteComponent,
})

function RouteComponent() {

  const { data} = useAuth();

  // -- START: Modals / Pop ups Logic --

  const [showModal_MyPick, setShowModal_MyPick] = useState(false);
  const [showModal_Draft_over, setShowModal_DraftOver] = useState(false);
  const [showModal_Bot_Picking, setShowModal_Bot_Picking] = useState(false);
 

  // -- END: Modals / Pop ups Logic -- 

    // -- START: Undrafted Players Logic ---

    // Filter Data
    const [positionFilter, setPositionFilter] = useState("All");

    // Search Data
    const [searchQuery, setSearchQuery] = useState("");

    // const { data, isLoading, isError } = useProducts(triggeredSearchTerm);

    // -- END: Undrafted Players Logic ---

    // -- START: Draft Logic & Current League Data ---

    // Get url props
    // const { leagueId } = Route.useLoaderData();

    // League Data
    const { data: leagueData, isLoading: isLoading_League, isError: isError_League } = useGetLeagueById("1");
    const [pickNumber, setPickNumber] = useState<number>(0);

    // Team Data
    const [currentTeam, setCurrentTeam] = useState<any>(null);

    // Bot is picking
    const [isBot, setIsBot] = useState<any>(false);

    // Player Data (of who got picked)
    const [pickedPlayer, setPickedPlayer] = useState<any>("");

    // Draft is over
    const [draftOver, setDraftOver] = useState(false);

    // -- END: Draft Logic & Current League Data ---
    

    // --- On-page load ---

    const league = leagueData?.league || null;

    console.log("League data here: ", league);

    const user = data?.user || null;

    console.log("USER data here: ", user);

    // League Data
    const current_pick_number = league?.currentPick || 0;
    // const total_picks = num_teams_in_league * TOTAL_POSITIONS;
    const total_picks = 3;

    if(current_pick_number > total_picks) {
      setDraftOver(true);
    }

    // GET Draft Pick Data
    useEffect(() => {
      if(current_pick_number && total_picks && current_pick_number > 0 && current_pick_number <= total_picks) {
        setPickNumber(current_pick_number);

        fetchDraftPick(current_pick_number);
      }
    }, [current_pick_number, total_picks]);

    useEffect(() => {
      console.log('CURRENT TEAM PICKING: ', currentTeam);
      
      // If current team user ID = my userID
      // allow me to pick a player
      if (currentTeam?.isBot) {
        setIsBot(true);
      } else {
        setIsBot(false);
      }
      // when player is picked then pass player ID to POST /api/teams/<team-ID>/add-player { position, playerAPIId } 
      // increment league current_pick
      // (loop) fetch current team picking (show loading modal)
      // If current team is_bot = true
      // BOT PICKS (show loading modal) -> POST api/bots/<team-ID>/pick-player { botId, position }
      // increment league current_pick
      // (loop) fetch current team picking (show loading modal)
    }, [currentTeam]);

    // Bot is picking logic here
    useEffect(() => {
      if(isBot) {

        // call function to handle bot pick
        handleBotPick();
      };
    }, [isBot]);

    // Draft is Over
    useEffect(() => {
      if(draftOver) {
        // window.location.href = "/leaderboard";
        setShowModal_DraftOver(true);
      };
    }, [draftOver]);

    useEffect(() => {
      console.log('Bot picking modal: ', showModal_Bot_Picking);
      console.log('Draft Over modal: ', showModal_Draft_over);
      console.log('My Pick modal: ', showModal_MyPick);
    }, [showModal_Bot_Picking, showModal_Draft_over, showModal_MyPick]);

    const fetchDraftPick = async (pick_number: number) => {
      try {
        const draftPick_data = await getDraftPick({ pick_number });
        const draftPick_teamId = draftPick_data.teamId;

        // Get Team by ID
        console.log('SUCCESS: GOT DRAFT PICK DATA ', draftPick_data);
        
        const team_data = await getTeamById({ team_id: draftPick_teamId });

        console.log('SUCCESS: GOT TEAM DATA ', team_data);

        setCurrentTeam(team_data);

      } catch (error) {
        console.error('Failed to fetch current team picking:', error);
      }
    };

    const goToNextPick = async () => {
      // Update league currentPick to currentPick + 1
      setCurrentTeam(null);
      setPickedPlayer(null);
      const nextPickNumber = pickNumber + 1
      setPickNumber(nextPickNumber);

      try {
        // await updateLeague({...league, currentPick: nextPickNumber})

        if(nextPickNumber <= total_picks) {
          fetchDraftPick(nextPickNumber);
        } else {
          setDraftOver(true);
        }
        
      } catch (err) {
        console.error("Error in Go To Next Pick:", err);
      }
    }

    const handleBotPick = () => {
      setShowModal_Bot_Picking(true);

      try {

        // call bot pick endpoint
        setTimeout(() => {
          console.log("wait 2 seconds");
        }, 3000);
        // returns player picked
        setPickedPlayer(playerData[0].name)
        
      } catch (err) {
        console.error("Error in Handle Bot Pick:", err);
      } finally {
        // setShowModal_Bot_Picking(false);
      }
    }

    // while fetching league data, Show loading spinner OR error message
    if (isLoading_League) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
    if (isError_League) return <p className="text-center text-red-500">Failed to load draft.</p>;

    let draftNum_prefix = '';

    if(pickNumber > 0) {
      switch (pickNumber) {
        case 1:
          draftNum_prefix = "st";
          break;
        case 2:
          draftNum_prefix = "nd";
          break;
        case 3:
          draftNum_prefix = "rd";
          break;
        default:
          draftNum_prefix = "th";
      }
    }

  return (
    <div className="">
      <div className="w-full h-full p-9 ml-5 mt-13">
        <h1 className="text-2xl font-bold mb-8">Player Draft Page</h1>
        
        <div className="max-w-4xl">
          {/* Current Pick Info */}
          <div className="flex items-center border-b pb-4 mb-4">
            {!draftOver ? (
              <Fragment>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <div className="flex items-center mr-6">
                      {/* Pick Number - section */}
                      <div>
                        <div className="text-sm">Pick</div>
                        <div className="font-bold text-lg">
                          {pickNumber}{draftNum_prefix}
                        </div>
                      </div>
                    </div>
                    {/* Current Pick Team - section */}
                    <div className="flex items-center">
                      {/* Team Logo */}
                      <div className="h-8 w-8 rounded-full border flex items-center justify-center mr-2">
                        {/* icon placeholder */}
                      </div>
                      {/* Team Name */}
                      <div>
                        <div className="text-sm">
                          Currently picking:
                        </div>
                        <div className="font-medium">
                          {currentTeam ? currentTeam.teamName : 'Loading...'}
                          {!isBot ? (
                            <span className="ml-1 text-red-500 font-bold">
                              (Your Pick!)
                            </span>
                          ) : (
                            <span className="ml-1 text-blue-500 font-bold">
                              (Bot)
                            </span>
                          )}
                        </div>
                        
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => window.location.href = '/my-team-page'} className="bg-green-400 hover:bg-green-700 text-black cursor-pointer">
                    View My Team
                  </Button>
                </div>
              </Fragment>
            ) : (
              <div className="flex items-center justify-between w-full">
                <h2 className="text-lg font-semibold text-gray-800">The draft has finished</h2>
                <div className="flex mb-4 gap-2">
                  <Button onClick={() => window.location.href = '/my-team-page'} className="bg-green-600 hover:bg-green-700 text-white cursor-pointer">
                    View My Team
                  </Button>
                  <Button onClick={() => window.location.href = '/leaderboard'} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                    View Leaderboard
                  </Button>
                </div>
              </div>
            )}
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
                <SelectItem value="QB">Quarter Backs</SelectItem>
                <SelectItem value="RB">Running Backs</SelectItem>
                <SelectItem value="WR">Wide Recievers</SelectItem>
                <SelectItem value="TE">Tight Ends</SelectItem>
                <SelectItem value="K">Kickers</SelectItem>
                <SelectItem value="DE">Defensive Ends</SelectItem>
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
            {playerData.map((player, _) => (
              <div key={player.playerApiId}>
                <TableRow player={player} team_id={currentTeam?.teamId} setShowModal_MyPick={setShowModal_MyPick} setPickedPlayer={setPickedPlayer} draftOver={draftOver} isBot={isBot} currentTeam={currentTeam} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ----- Modals / Pop-ups ------- */}

      {/* Your pick was successful confirmation modal */}
      <Dialog open={showModal_MyPick} onOpenChange={setShowModal_MyPick}>
        <DialogContent className="text-center max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg">Pick Successful</DialogTitle>
            <DialogDescription className="text-2xl font-bold mt-2">You got {pickedPlayer}</DialogDescription>
          </DialogHeader>

          <div className="my-6 flex justify-center">
            <CheckCircle2 className="text-green-500 w-16 h-16" />
          </div>

          <DialogFooter>
            <Button 
              onClick={() => {
                setShowModal_MyPick(false);
                goToNextPick();
              }}
              className="w-full cursor-pointer"
              >
              Next Pick
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bot is picking Modal */}
      <Dialog open={showModal_Bot_Picking} onOpenChange={setShowModal_Bot_Picking}>
        <DialogContent className="text-center max-w-sm" style={{ zIndex: 100 }}>
          {(pickNumber === null || !pickedPlayer) ? (
            <DialogHeader>
              <DialogTitle className="text-lg">Other team is picking...</DialogTitle>
            </DialogHeader>
          ) : (
            <Fragment>
              <DialogHeader>
                <DialogTitle className="text-lg">For the {pickNumber}{draftNum_prefix} Pick</DialogTitle>
                <DialogDescription className="text-2xl font-bold mt-2">{currentTeam.teamName} got {pickedPlayer}</DialogDescription>
              </DialogHeader>

              <div className="my-6 flex justify-center">
                <CheckCircle2 className="text-green-500 w-16 h-16" />
              </div>

              <DialogFooter>
                <Button 
                  onClick={() => {
                    setShowModal_Bot_Picking(false);
                    goToNextPick();
                  }}
                  className="w-full cursor-pointer"
                  >
                  Next Pick
                </Button>
              </DialogFooter>
            </Fragment>
          ) }
        </DialogContent>
      </Dialog>


      {/* Draft Over Modal */}
      <Dialog open={showModal_Draft_over} onOpenChange={setShowModal_DraftOver}>
        <DialogContent className="text-center max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg">The Draft has finished</DialogTitle>
          </DialogHeader>

          <DialogFooter>
            <div className="w-full flex gap-2">
              <Button 
                onClick={() => window.location.href = '/my-team-page'}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                >
                View My Team
              </Button>
              <Button 
                onClick={() => window.location.href = '/leaderboard'}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                View Leaderboard
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

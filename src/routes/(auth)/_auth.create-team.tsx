import { useState, useEffect } from "react";

// Routing
import { createFileRoute } from '@tanstack/react-router'

// Actions
import { test } from "@/utils/testActions";
import { editBot, createBot } from "@/utils/botActions";
import { createTeam } from "@/utils/teamActions";
import { createLeague } from "@/utils/leagueActions";
import { createDraftSchedule } from "@/utils/draftPickActions";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// Initial State
const initialState = {
  team_name: '',
  num_players: 0,
  img: ''
}

export const Route = createFileRoute('/(auth)/_auth/create-team')({
  component: RouteComponent,
})

function RouteComponent() {
  // State for form data
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!localStorage.getItem('token')){
      localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NDczMTU2MzcsImV4cCI6MTc0NzMyMjgzNywidXNlcklkIjoxLCJlbWFpbCI6ImpvaG5AdGVzdC5jb20iLCJ1c2VyTmFtZSI6IkpvaG4gRG9lIn0.BXLzw9s80hM4GUPlSGEjbl-zZIpgNWu5iclJmP7y5Zk');
    }
  }, []);

  // Destructure the form data
  const { 
    team_name,
    num_players,
    img
  } = formData;

  // Function to handle input change
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
  
    if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0];
  
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Save base64 string as img
          setFormData(prev => ({ ...prev, img: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submit
  const onSubmit = async (e:any) => {
    e.preventDefault(); 

    // -- Form validation for required input fields --
    const requiredFields = [
      { name: "team_name", value: team_name, label: "Team name" },
      { name: "num_players", value: num_players, label: "# of players" }
    ];
  
    for (let field of requiredFields) {
      if (
        field.value === '' || 
        (typeof field.value === 'number' && field.value <= 0)
      ) {

        console.log(`ERROR: ${field.label} is required.`)

        // TODO: Trigger alert
        return;
      }
    }

    if (num_players < 1) {

        console.log(`ERROR: # of players must be greater than 0.`)

        // TODO: Trigger alert
        return;
    }
    
    // -- END: Form validation for required input fields --

    setLoading(true); // show loading modal
    
    try {
      console.log("form input: ", formData);
      
      // TODO: Create Team
      await createDraft(formData);

      // Clear form on success
      setFormData(initialState);

      // TODO: Trigger alert

    } catch (err: any) {
      
      // Get specific error message from response
      const errorMessage =
      err?.response?.data?.error ||
      err?.message ||
      "Something went wrong trying to Create.";

      console.error('Create Team failed:', errorMessage);


      // TODO: Trigger alert
    } finally {
      setLoading(false); // close modal
    }
  };

  // Handle League, Bots, Teams, and Draft
  const createDraft = async ({ 
    team_name,
    num_players,
    img
  }: { 
    team_name: string; 
    num_players: number; 
    // user_id?: number; // if needed
    img: string;
}) => {

    console.log("INSIDE CREATE DRAFT")

    try {
      // Handle Create Draft
      await test();
      // -------------------------
      // 1. Create league

      const league_res = await createLeague({ num_players });
      const league_id = league_res.id;

      // 2. Create user's team
      const user_id = 1; // TODO: replace with actual ID
      const my_team_res  = await createTeam({ 
        team_name, 
        img,
        is_bot: false,
        league_id,
        user_id: user_id
      });
      my_team_res;
      // 3. Create bots, assign team, link team to bot
      const num_bots = num_players - 1;
      const botPromises = [];

      for (let i = 0; i < num_bots; i++) {
        botPromises.push(
          (async () => {
            // 3a. Create bot
            const bot_res = await createBot({ league_id });
            const bot_id = bot_res.botId;

            // 3b. Create team for bot
            const bot_team_res = await createTeam({ 
              team_name: `Bot ${i + 1}`, 
              // img,
              is_bot: true,
              bot_id,
              league_id
            });
            const bot_team_id = bot_team_res.teamId;

            // 3c. Update bot with assigned team
            await editBot({ bot_id, team_id: bot_team_id, league_id });
          })()
        )
      }

      await Promise.all(botPromises);

      // Step 4: Create draft pick schedule
      console.log('ALL DONE (with bots)');
      console.log('CREATING DRAFT NOW...');
      await createDraftSchedule({ league_id });

      // Start Game
      console.log('Starting Game, Redirecting...');
      window.location.href = "/draft";

    } catch (err) {
      console.error("Error in createDraft:", err);
    }
  }

  return (
    <div className="w-full h-full p-9 ml-3 mt-13 bg-gray-800 ">
      <h1 className="text-2xl font-bold mb-8 text-white">Create Team</h1>

      {/* -- Start: Start of Form -- */}
      
      <div className="space-y-8 max-w-4xl">
        <div>
          <h2 className="text-lg font-medium mb-4 text-white">Add Team Logo</h2>
          <div className="flex">
            <div className="h-24 w-24 rounded-full border text-white flex items-center justify-center overflow-hidden">
              {img ? (
                <img 
                  src={img} 
                  alt="Team Logo Preview" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-3xl">A</span>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => document.getElementById('img')?.click()}
              className="text-sm cursor-pointer ml-5 mt-8 bg-green-400 text-black"
            >
              {img ? 'Change Photo' : 'Upload Photo'}
            </Button>
            {/* Hidden file input for photo selection */}
            <input
                onChange={onChange} 
                id="img" 
                type="file" 
                accept="image/png, image/gif, image/jpeg, image/jpg"
                hidden
            />
            {/* Remove img Btn */}
            {img && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFormData({...formData, img: ''})}
                className="text-sm cursor-pointer text-red-500 hover:text-red-700 ml-5 mt-8"
              >
                Remove
              </Button>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="team_name" className="block text-lg font-medium mb-2 text-white">Team Name</label>
          <Input 
            id="team_name"
            name="team_name"
            value={team_name}
            onChange={onChange}
            className="rounded-md w-full max-w-xl text-white"
            placeholder="Enter your team name"
          />
        </div>
        
        <div>
          <label htmlFor="num_players" className="block text-lg font-medium mb-2 text-white">Number of bots in League</label>
          <Input 
            id="num_players"
            name="num_players"
            type="number"
            value={num_players}
            onChange={onChange}
            className="rounded-md w-32 text-white"
            min="1" 
            max="12"
          />
        </div>
        
        <div className="pt-4">
          <Button 
            className="bg-green-400 hover:bg-white text-black font-medium px-12 py-6 text-lg rounded-md"
            onClick={onSubmit}
          >
            Start Draft
          </Button>
        </div>
      </div>

      {/* -- END: Start of Form -- */}

      {/* Loading Modal */}
      <Dialog open={loading}>
        <DialogContent className="flex flex-col items-center justify-center space-y-4 py-12">
          <DialogTitle>
            <VisuallyHidden>Starting Draft</VisuallyHidden>
          </DialogTitle>
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900" />
          <p className="text-lg font-medium">Starting Draft...</p>
        </DialogContent>
      </Dialog>

    </div>
  )
}
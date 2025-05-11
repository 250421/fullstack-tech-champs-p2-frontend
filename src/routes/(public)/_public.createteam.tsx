import { useState } from "react";

// Routing
import { createFileRoute } from '@tanstack/react-router'

// Actions
import { createTeam } from "@/utils/teamActions";

// Components
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

// Initial State
const initialState = {
  team_name: '',
  num_players: 0,
  img: ''
}


export const Route = createFileRoute('/(public)/_public/createteam')({
  component: RouteComponent,
})

function RouteComponent() {

  // State for form data
  const [formData, setFormData] = useState(initialState);

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
    
    try {
      console.log("form input: ", formData);
      
      // TODO: Create Team
      await createTeam(formData);

      // Clear form on success
      setFormData(initialState);

      // TODO: Trigger alert

    } catch (err: any) {
      
      // Get specific error message from response
      const errorMessage =
      err?.response?.data?.error ||
      err?.message ||
      "Something went wrong trying to Create.";

      console.error('Create Product failed:', errorMessage);


      // TODO: Trigger alert
    }
  };

  return (
    <div className="w-full h-full p-6">
      <h1 className="text-2xl font-bold mb-8">Create Team</h1>
      
      <div className="space-y-8 max-w-4xl">
        <div>
          <h2 className="text-lg font-medium mb-4">Add Team Logo</h2>
          <div className="flex">
            <div className="h-24 w-24 rounded-full border flex items-center justify-center overflow-hidden">
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
              onClick={() => document.getElementById('img').click()}
              className="text-sm cursor-pointer"
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
                className="text-sm cursor-pointer text-red-500 hover:text-red-700"
              >
                Remove
              </Button>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="team_name" className="block text-lg font-medium mb-2">Team Name</label>
          <Input 
            id="team_name"
            name="team_name"
            value={team_name}
            onChange={onChange}
            className="rounded-md w-full max-w-xl"
            placeholder="Enter your team name"
          />
        </div>
        
        <div>
          <label htmlFor="num_players" className="block text-lg font-medium mb-2">Number of bots in League</label>
          <Input 
            id="num_players"
            name="num_players"
            type="number"
            value={num_players}
            onChange={onChange}
            className="rounded-md w-32"
            min="1" 
            max="12"
          />
        </div>
        
        <div className="pt-4">
          <Button 
            className="bg-green-200 hover:bg-green-300 text-black font-medium px-12 py-6 text-lg rounded-md"
            onClick={onSubmit}
          >
            Start Draft
          </Button>
        </div>
      </div>
    </div>
  )
}

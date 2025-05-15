import axios from 'axios';

export async function createTeam({ 
    team_name, 
    is_bot,
    league_id,
    user_id,
    bot_id,
    img,
  }: { 
    team_name: string; 
    is_bot?: boolean; 
    league_id: number,
    user_id?: number; // optional
    bot_id?: number; // optional
    img?: string;
}) {
    console.log("ABOUT TO CREATE TEAM")
  try {
    const token = localStorage.getItem('token');

    // Check if the token is not available
    if (!token) {
        throw new Error('No authentication token found');
    }

    console.log("TOKEN FOUND")

    console.log("PASSING THIS: ", { 
        team_name,
        is_bot, 
        league_id,
        user_id,
        bot_id,
        img
    });

    const res = await axios.post('http://localhost:8080/api/teams', { 
        team_name,
        is_bot, 
        league_id,
        user_id,
        bot_id,
        img
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    console.log("TEAM DATA: ", res.data);
    
    // TODO: Start draft & Redirect

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || 'Request failed. Please try again.';
      throw new Error(message);
    } else {
      throw new Error('Something went wrong.');
    }
  }
}
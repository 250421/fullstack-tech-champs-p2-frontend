import axios from 'axios';

export async function createBot({ 
    league_id
  }: { 
    league_id: number
}) {
    console.log("ABOUT TO CREATE BOT")
  try {
    const token = localStorage.getItem('token');

    // Check if the token is not available
    if (!token) {
        throw new Error('No authentication token found');
    }

    console.log("TOKEN FOUND")

    console.log("PASSING THIS: ", { 
        league_id
    });

    const res = await axios.post('http://localhost:8080/api/bots', { 
        leagueId: league_id
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    console.log("BOT DATA: ", res.data);
    
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

export async function editBot({ 
    team_id,
    bot_id,
    league_id
  }: {
    team_id: number;
    bot_id?: number;
    league_id: number;
}) {
    console.log("ABOUT TO EDIT BOT")
  try {
    const token = localStorage.getItem('token');

    // Check if the token is not available
    if (!token) {
        throw new Error('No authentication token found');
    }

    const res = await axios.put(`http://localhost:8080/api/bots/${bot_id}`, { 
        teamId: team_id,
        leagueId: league_id
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    console.log("BOT UPDATED, DATA: ", res.data);
    // window.location.href = '/products';

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || 'Login failed. Please try again.';
      throw new Error(message);
    } else {
      throw new Error('Something went wrong.');
    }
  }
}
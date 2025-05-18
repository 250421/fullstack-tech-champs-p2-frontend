import axios from 'axios';

export async function createLeague({ 
    num_players
  }: { 
    num_players: number
}) {
    console.log("ABOUT TO CREATE LEAGUE")
  try {
    const token = localStorage.getItem('token');

    // Check if the token is not available
    if (!token) {
        throw new Error('No authentication token found');
    }

    console.log("TOKEN FOUND")

    console.log("PASSING THIS: ", { 
        num_players
    });

    const res = await axios.post('http://3.20.227.225:8082/api/leagues', { 
        numPlayers: num_players
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    console.log("LEAGUE DATA: ", res.data);
    
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

export async function editLeague({ 
    id,
    currentPick,
    drafting,
    numPlayers
  }: {
    id: number;
    currentPick: number;
    drafting: boolean;
    numPlayers: number;
}) {
    console.log("ABOUT TO EDIT LEAGUE")
  try {
    const token = localStorage.getItem('token');

    // Check if the token is not available
    if (!token) {
        throw new Error('No authentication token found');
    }

    const res = await axios.put(`http://3.20.227.225:8082/api/leagues/${id}`, { 
        currentPick,
        drafting,
        numPlayers
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    console.log("LEAGUE UPDATED, DATA: ", res.data);

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
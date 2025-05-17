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

    const res = await axios.post('http://localhost:8080/api/leagues', { 
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
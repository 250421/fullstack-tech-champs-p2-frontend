import axios from 'axios';

export async function createTeam({ 
    team_name,
    num_players,
    // user_id,
    img
  }: { 
    team_name: string; 
    num_players: number; 
    // user_id?: number; // if needed
    img: string;
}) {
    console.log("ABOUT TO CREATE TEAM")
  try {
    // const token = localStorage.getItem('token');

    // Check if the token is not available
    // if (!token) {
    //     throw new Error('No authentication token found');
    // }

    // const res = await axios.post('http://localhost:8080/api/teams', { 
    //     team_name,
    //     num_players, 
    //     // user_id,
    //     img
    // },
    // {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    //   withCredentials: true,
    // });
    // console.log("TEAM DATA: ", res.data);
    
    console.log("TEAM DATA: ", { 
        team_name,
        num_players, 
        img
    });
    
    // TODO: Start draft & Redirect

    // return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || 'Request failed. Please try again.';
      throw new Error(message);
    } else {
      throw new Error('Something went wrong.');
    }
  }
}

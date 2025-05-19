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

    let res;

    if(!is_bot) {
        res = await axios.post('http://3.20.227.225:8082/api/teams', { 
            teamName: team_name,
            isBot: is_bot, 
            leagueId: league_id,
            userId: user_id,
            imgUrl: img
        },
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
        });
    } else {
        res = await axios.post('http://3.20.227.225:8082/api/bots/teams', { 
            teamName: team_name,
            leagueId: league_id,
            botId: bot_id,
            // imgUrl: img
        },
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
        });
    }
    console.log("TEAM DATA: ", res?.data);
    
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

export async function getTeamById({ 
    team_id
  }: { 
    team_id: String
}) {
  
  console.log("FETCHING TEAM BY ID");
  try {

    const token = localStorage.getItem('token');

    // Check if the token is not available
    if (!token) {
        throw new Error('No authentication token found');
    }

    console.log("TOKEN FOUND")

    console.log("PASSING THIS: ", { 
        team_id
    });

    // Backend request
    const res = await axios.get(`http://3.20.227.225:8082/api/teams/${team_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });

    console.log("GOT TEAM DATA : ", res.data);
    return res.data;

  } catch (error) {
    console.error("Error fetching team data:", error);
    // return null;
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || 'Request failed. Please try again.';
      throw new Error(message);
    } else {
      throw new Error('Something went wrong.');
    }
  }
}

export async function addPlayer({ 
    team_id,
    player_api_id, 
    position
  }: { 
    team_id: number,
    player_api_id: number; 
    position: string;
}) {
    console.log("ABOUT TO ADD PLAYER TO TEAM")
  try {
    const token = localStorage.getItem('token');

    // Check if the token is not available
    if (!token) {
        throw new Error('No authentication token found');
    }

    console.log("TOKEN FOUND")

    console.log("PASSING THIS: ", { 
        player_api_id,
        position,
        team_id
    });

    let res;

    res = await axios.post(`http://3.20.227.225:8082/api/teams/${team_id}/add-player`, { 
        position,
        playerApiId: player_api_id
    },
    {
      headers: {
          Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    console.log("NEW TEAM DATA: ", res?.data);
    
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

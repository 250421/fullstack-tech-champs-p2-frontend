import axios from 'axios';

const TOTAL_POSITIONS = 6;

export async function createDraftSchedule({ 
    league_id
  }: { 
    league_id: number
}) {
    console.log("ABOUT TO CREATE DRAFT SCHEDULE")
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

    // Create Draft Schedule:
    // ------------------------

    // 1. Get all teams in the league
    const teamsRes = await axios.get(`http://localhost:8080/api/teams/league/${league_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    const teams = teamsRes.data;
    const numTeams = teams.length;

    if (numTeams === 0) {
      throw new Error('No teams found in the league.');
    }

    // 2. Calculate total picks
    const totalPicks = TOTAL_POSITIONS * numTeams;
    const pickPromises = [];

    // 3. Generate draft pick schedule in snake draft order
    const draftOrder: number[] = [];

    for (let round = 0; round < TOTAL_POSITIONS; round++) {
      const roundOrder = teams.map((team: any) => team.id);
      if (round % 2 !== 0) roundOrder.reverse(); // Snake order
      draftOrder.push(...roundOrder);
    }

    // 4. Create draft picks
    for (let i = 0; i < totalPicks; i++) {
      const team_id = draftOrder[i];
      const pick_number = i + 1;

      pickPromises.push(
        axios.post(`http://localhost:8080/api/draft_picks`, { 
            league_id,
            team_id,
            pick_number 
        },
        {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, 
        })
      );
    }

    const results = await Promise.all(pickPromises);
    console.log("DRAFT PICKS CREATED:", results.map(r => r.data));
    console.log("DRAFT IS READY")
    
    // TODO: Start draft & Redirect

    // return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || 'Request failed. Please try again.';
      throw new Error(message);
    } else {
      throw new Error('Something went wrong.');
    }
  }
}

export async function editDraftPick({ 
    player_id,
    pick_number,
  }: {
    player_id: number;
    pick_number?: number;
}) {
    console.log("ABOUT TO EDIT DRAFT PICK")
  try {
    const token = localStorage.getItem('token');

    // Check if the token is not available
    if (!token) {
        throw new Error('No authentication token found');
    }

    const res = await axios.put(`http://localhost:8080/api/draft_picks/pick-number/${pick_number}`, { 
        player_id
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    console.log("DRAFT PICK UPDATED, DATA: ", res.data);
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
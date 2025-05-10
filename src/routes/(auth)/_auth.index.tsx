import { useAuth } from '@/features/auth/hook/useAuth';
import { createFileRoute, Navigate, Link } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute("/(auth)/_auth/")({
  component: Index,
})

function Index() {
  const { data: user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Mock data - replace with your actual data fetching
  const userTeam = {
    created: true, // Change based on actual user data
    name: "Dragon Warriors",
    wins: 12,
    losses: 3
  };

  const leaderboard = [
    { rank: 1, name: "Dragon Warriors", wins: 12, losses: 3 },
    { rank: 2, name: "Phoenix Flyers", wins: 10, losses: 5 },
    { rank: 3, name: "Titan Strikers", wins: 9, losses: 6 }
  ];

  const matchHistory = [
    { opponent: "Phoenix Flyers", result: "Win", score: "3-1", date: "2023-05-15" },
    { opponent: "Titan Strikers", result: "Loss", score: "1-2", date: "2023-05-10" },
    { opponent: "Storm Chasers", result: "Win", score: "2-0", date: "2023-05-05" }
  ];

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white">Welcome {user.name}</h1>
      
      {/* Team Card */}
      <Card className="bg-gray-800 border-gray-700 hover:border-green-400 transition-colors duration-200">
        <CardHeader>
          <CardTitle className="text-white">Your Team</CardTitle>
        </CardHeader>
        <CardContent>
          {userTeam.created ? (
            <div className="space-y-2">
              <p className="text-lg font-medium text-white">{userTeam.name}</p>
              <div className="flex gap-4">
                <span className="text-green-400">Wins: {userTeam.wins}</span>
                <span className="text-red-400">Losses: {userTeam.losses}</span>
              </div>
              <Button 
                variant="outline" 
                className="mt-4 bg-green-400 text-gray-900 hover:bg-green-500 hover:text-white"
              >
                <Link to="/my-team-page">Manage Team</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-300">You haven't created a team yet</p>
              <Button 
                className="bg-green-400 text-gray-900 hover:bg-green-500 hover:text-white"
                asChild
              >
                <Link to="/create-team">Create Your Team</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leaderboard Card */}
      <Card className="bg-gray-800 border-gray-700 hover:border-green-400 transition-colors duration-200">
        <CardHeader>
          <CardTitle className="text-white">Top Teams</CardTitle>
          <CardDescription className="text-gray-400">Current leaderboard standings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map(team => (
              <div 
                key={team.rank} 
                className="flex justify-between items-center hover:bg-gray-700 p-2 rounded transition-colors duration-150"
              >
                <span className="font-medium text-white">#{team.rank} {team.name}</span>
                <span className="text-sm text-gray-400">{team.wins}W - {team.losses}L</span>
              </div>
            ))}
          </div>
          <Button 
            variant="link" 
            className="mt-4 pl-0 text-green-400 hover:text-green-300"
            asChild
          >
            <Link to="/leaderboard">View Full Leaderboard</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Match History Card */}
      <Card className="bg-gray-800 border-gray-700 hover:border-green-400 transition-colors duration-200">
        <CardHeader>
          <CardTitle className="text-white">Your Match History</CardTitle>
          <CardDescription className="text-gray-400">Recent game results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {matchHistory.map((match, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center border-b border-gray-700 pb-2 hover:bg-gray-700 p-2 rounded transition-colors duration-150"
              >
                <div>
                  <p className="font-medium text-white">vs {match.opponent}</p>
                  <p className="text-sm text-gray-400">{match.date}</p>
                </div>
                <div className={`font-bold ${match.result === "Win" ? "text-green-400" : "text-red-400"}`}>
                  {match.result} ({match.score})
                </div>
              </div>
            ))}
          </div>
          <Button 
            variant="link" 
            className="mt-4 pl-0 text-green-400 hover:text-green-300"
            asChild
          >
            <Link to="/match-history">View Full History</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
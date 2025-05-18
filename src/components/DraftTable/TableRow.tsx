import { useState } from 'react';

// Hooks
import { addPlayer } from '@/utils/teamActions';
import { editDraftPick } from '@/utils/draftPickActions';

// Components
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";

type Player = {
    position: string;
    name: string;
    drafted: Boolean;
    fantasyPoints: Number;
    playerApiId: Number;
    // Add other fields as needed
};

type TableRowProps = {
    player: Player;
    team_id: number;
    draftOver: boolean;
    isBot: boolean;
    currentTeam: any;
    pickNumber: number;
    pickedPlayer: string;
    setShowModal_MyPick: (showModal_MyPick: boolean) => void;
    setPickedPlayer: (pickedPlayer: string) => void;
};

const TableRow = ({
    player,
    team_id,
    draftOver,
    isBot,
    currentTeam,
    pickNumber,
    pickedPlayer,
    setShowModal_MyPick,
    setPickedPlayer
} : TableRowProps) => {

    // Hide component if deleted
    const [visible, setVisible] = useState(true);

    // When player picked show loading
    const [processing, setProcessing] = useState(false);
    const [picked, setPicked] = useState(false);

    // Confirmation Modal Logic
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Handle player selection
    const handlePickPlayer = async (player:any) => {
        console.log(`Picked player: ${player.name}`);
        console.log(`add to team: ${team_id}`);
        setProcessing(true);

        try {
            if(pickedPlayer) {
                alert(`You already picked ${pickedPlayer}`);
            } else {
                if(!picked) {
                    await addPlayer({team_id, player_api_id: player.playerApiId, position: player.position})
                    await editDraftPick({pick_number: pickNumber, player_data: player.name})

                    setPicked(true);
                    setShowModal_MyPick(true);
                    setPickedPlayer(player.name)
                } else {
                    alert('Player not available');
                }
            }
        } catch (err) {
            console.error("Error in adding player to team:", err);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div 
            key={player.playerApiId.toString()} 
            className="grid grid-cols-12 border-b py-3 items-center"
            style={!visible ? {display: 'none'} : {}}
        >
            <div className="col-span-2 text-gray-600">{player.position}</div>
            <div className="col-span-8">
                <div className="flex items-center">
                    {/* <div className="h-8 w-8 rounded-full border flex items-center justify-center mr-2">
                        Player icon placeholder
                    </div> */}
                    <div>
                        <div className="font-medium">{player.name}</div>
                        {/* <div className="text-sm text-gray-600">{player.team}</div> */}
                    </div>
                </div>
            </div>
            {(!draftOver && !isBot && currentTeam) && (
                <div className="col-span-2">
                    <Button
                        className={`${picked ? 'bg-green-200 hover:bg-green-300' : 'bg-yellow-200 hover:bg-yellow-300'} text-black px-4 py-1 h-8 rounded-md cursor-pointer`}
                        onClick={() => handlePickPlayer(player)}
                    >
                        {!picked ? processing ? 'Processing...' : 'Pick' : 'Picked'}
                    </Button>
                </div>
            )}
        </div>
    ) 
}

export default TableRow;

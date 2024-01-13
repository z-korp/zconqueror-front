import './App.css';
import NewGame from './components/NewGame';
import PlayPanel from './components/PlayPanel';
import SidePlayerInfo from './components/SidePlayerInfo';
import FortifyPanel from './components/map/FortifyPanel';
import Map from './components/map/Map';
import { TooltipProvider } from './components/ui/tooltip';
import { Phase, useElementStore } from './utils/store';
import Burner from './components/Burner';
import { defineSystem, Has } from '@dojoengine/recs';
import { useEffect, useState } from 'react';
import { NetworkLayer } from './dojo/createNetworkLayer';

interface AppProps {
	networkLayer: NetworkLayer | undefined;
}
  
const App: React.FC<AppProps> = ({ networkLayer }) => {
	const {
		world,
		components: {
			Player
		}
	} = networkLayer;

	const [players, setPlayers] = useState({});
	const [playersInGame, setPlayersInGame] = useState<any[]>([]);

	const { current_state } = useElementStore((state) => state);

	useEffect(() => {
		// filter on the current game_id
		// using this?   const { game_id } = useElementStore((state) => state);
		const gameid = 1
		const newPlayersInGame: any[] = Object.values(players)
			.filter((p: any) => p.game_id == gameid)
		console.log("players", players)
		console.log("in game", gameid, newPlayersInGame)
		setPlayersInGame(newPlayersInGame)
	}, [players])

	useEffect(() => {
		defineSystem(world, [Has(Player)], function ({ value: [newValue] }: any) {
			setPlayers((prevValue) => { return {
				...prevValue,
				[newValue.game_id + " " + newValue.index]: newValue
			}})
		})
	}, [])

	const isFortifyPanelVisible =
		current_state === Phase.FORTIFY || current_state === Phase.ATTACK || current_state === Phase.DEPLOY;

	return (
		<TooltipProvider>
			<NewGame />
			<Burner />
			<div className='flex'>
				<div className='w-1/6 mr-4'>{isFortifyPanelVisible && <FortifyPanel />}</div>
				<div className='w-5/6 pr-8'>
					<Map />
				</div>
			</div>
			<div className='absolute top-24 right-0 flex gap-14 flex-col'>
				{playersInGame.map((entity, index) => (
					<SidePlayerInfo
						key={index}
						index={index}
						entity={entity}
					/>
				))}
			</div>
			<div className='flex justify-center'>
				{playersInGame.map((entity, index) => (
					<PlayPanel
						key={index}
						index={index}
						entity={entity}
					/>
				))}
			</div>
		</TooltipProvider>
	);
}

export default App;

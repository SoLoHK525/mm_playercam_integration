import {Player} from "csgo-gsi-types";


interface BasicPlayer {
  steamid: string;
  name: string;
  observer_slot: number;
}

export const players = new Map<string, BasicPlayer>();
export const playerIdToCamMap = new Map<string, number>();

export const handleCamChange = (_player: Player | null = null) => {
  if (!_player) {
    // hide cam
    console.log("Cam changed to null");
    changeCam(-1);
    return;
  }

  const player = transformPlayerToBasicPlayer(_player);

  if (!players.has(player.steamid)) {
    players.set(player.steamid, player);
  }

  if (!playerIdToCamMap.has(player.steamid)) {
    return;
  }

  changeCam(playerIdToCamMap.get(player.steamid) ?? -1);
  console.log(`Cam changed to ${player.name}: ${playerIdToCamMap.get(player.steamid)}}`);
}

function transformPlayerToBasicPlayer(player: Player): BasicPlayer {
  return {
    steamid: player.steamid,
    name: player.name,
    observer_slot: player.observer_slot
  }
}

export function changeCam(index: number) {

}

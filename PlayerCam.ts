import {Player} from "csgo-gsi-types";
import axios from "axios";
import config from "./config";

const request = axios.create({
  baseURL: config.cam_endpoint,
  timeout: 1000
})

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
  if (index < 0) {
    request.get(`/press/bank/1/18`).catch(err => {
      console.log(`Error when trying to toggle off cam: ${err}`);
    });
    return;
  }

  const cam = index == 0 ? 10 : index;

  request.get(`/press/bank/3/${cam}`)
    .then(() => {
      request.get(`/press/bank/1/17`).catch(err => {
        console.log(`Error when trying to toggle on cam: ${err}`);
      });
    }).catch(err => {
    console.log(`Error when trying to change cam: ${err}`);
  })
}

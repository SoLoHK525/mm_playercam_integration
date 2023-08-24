import {GameState, Player} from "csgo-gsi-types";
import {handleCamChange, playerIdToCamMap, players as camPlayers} from "./PlayerCam";
import {loadMapping} from "./index";

let previousGameState: GameState | null = null;

export function onGameState(gameState: GameState) {
  hydratePlayerSlotToCamMap(gameState);
  spectatingPlayerHandler(gameState);

  previousGameState = gameState;
}


let hydrated = false;

function hydratePlayerSlotToCamMap(gameState: GameState) {
  if (hydrated) {
    return;
  }
  const players = Object.entries(gameState.allplayers ?? {});

  if (players.length != 10) {
    return;
  }

  players.forEach(([steamid, player]) => {
    const slot = player.observer_slot;
    playerIdToCamMap.set(steamid, slot);
    camPlayers.set(steamid, {
      steamid,
      name: player.name,
      observer_slot: slot
    });
  });

  console.log("Hydrated playerSlotToCamMap");

  hydrated = true;

  loadMapping();
}

function spectatingPlayerHandler(gameState: GameState) {
  if (previousGameState?.player !== null && gameState.player == null) {
    onSpectatingPlayerChanged(null);
    return;
  }

  if (gameState.player?.activity == "free" || (gameState.player?.team !== "CT" && gameState.player?.team !== "T")) {
    onSpectatingPlayerChanged(null);
    return;
  }

  if (previousGameState?.player?.steamid !== gameState.player.steamid) {
    onSpectatingPlayerChanged(gameState.player);
  }
}

let previousSpectatingPlayer: Player | null = null;

function onSpectatingPlayerChanged(player: Player | null = null) {
  if (previousSpectatingPlayer === null && player === null) {
    return;
  }

  if (previousSpectatingPlayer?.steamid === player?.steamid) {
    return;
  }

  console.log(`Spectating player changed to ${player?.name ?? "no one"}`);

  handleCamChange(player);

  previousSpectatingPlayer = player;
}



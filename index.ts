import express from "express";
import {onGameState} from "./GameStateIntegration";
import {playerIdToCamMap, players} from "./PlayerCam";
import { readFile, writeFile } from "fs/promises";


const app = express();

const PORT = 3005;

app.use(express.static('public'))

app.get("/mapping", (req, res) => {
  const arr = getPlayerCamMapping();

  res.json(arr).status(200);
});

function getPlayerCamMapping() {
  const arr = [...playerIdToCamMap.entries()].map(([steamid, cam]) => (
    {
      name: players.get(steamid)?.name,
      steamid,
      cam
    }
  ));

  return arr;
}

app.post("/mapping", (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});

  let data = "";

  req.on('data', (_data) => {
    data += _data;
  });

  req.on('end', () => {
      try {
        const payload = JSON.parse(data);
        handleMappingUpdate(payload);
      } catch (err) {
        console.log(`Error when trying to parse JSON: ${err}`);
      }
      res.end('ok');
    }
  );
});

function handleMappingUpdate(payload: {
  steamid: string;
  cam: number;
}[]) {
  console.log("Updating mapping");
  payload.forEach(({steamid, cam}) => {
    playerIdToCamMap.set(steamid, cam);
  });

  saveMapping();
}

export function loadMapping() {
  console.log("Loading mapping");
  readFile('mapping.json', 'utf8').then((data) => {
    const arr = JSON.parse(data);
    handleMappingUpdate(arr);
  }).catch(err => {
    console.log(`Error when trying to load mapping: ${err}`);
  });
}

function saveMapping() {
  const arr = getPlayerCamMapping();
  const json = JSON.stringify(arr);

  writeFile('mapping.json', json, 'utf8').then(() => {
    console.log("Mapping saved");
  });
}

app.post("/api/gsi", (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});

  let data = "";

  req.on('data', (_data) => {
    data += _data;
  })


  req.on('end', () => {
    try {
      const payload = JSON.parse(data);
      onGameState(payload);
    } catch (err) {
      console.log(`Error when trying to parse JSON: ${err}`);
    }
    res.end('ok');
  })
})

app.listen(PORT, () => {
  console.log(`HTTP Server listening on port ${PORT}`);
});

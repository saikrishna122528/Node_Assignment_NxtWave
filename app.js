const express = require("express");
const app = express();
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

let db = null;
app.use(express.json());

const initializeDataBaseServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server Running On Port 3000");
    });
  } catch (error) {
    console.log(`DB Error : ${error}`);
    process.exit(1);
  }
};

initializeDataBaseServer();

//To Get Players Whole Data

app.get("/players/", async (request, response) => {
  const sqlQuery = `SELECT player_id AS playerId,
  player_name AS playerName,
  jersey_number As jerseyNumber,
  role
   FROM cricket_team;`;
  const result = await db.all(sqlQuery);
  response.send(result);
});

//To Create A New Player In Database

app.post("/players/", async (request, response) => {
  const data = request.body;
  const { playerName, jerseyNumber, role } = data;
  const toAddPlayerQuery = `INSERT INTO 
    cricket_team(player_name,jersey_number,role) 
    VALUES ('${playerName}',${jerseyNumber}
    ,'${role}');`;

  const result = await db.run(toAddPlayerQuery);
  response.send("Player Added to Team");
});

//To GET a Particular Player Data

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const toGetaPlayerData = `SELECT player_id AS playerId,
    player_name AS playerName,jersey_number As jerseyNumber,
    role 
    FROM cricket_team 
    WHERE player_id=${playerId};`;
  const playerData = await db.get(toGetaPlayerData);
  response.send(playerData);
});

//To Update a Player Data

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const data = request.body;
  const { playerName, jerseyNumber, role } = data;
  const updatePlayerDataQuery = `UPDATE cricket_team 
    SET player_name="${playerName}",
    jersey_number=${jerseyNumber},role="${role}" 
    WHERE player_id=${playerId};`;
  await db.run(updatePlayerDataQuery);
  response.send("Player Details Updated");
});

//To Delete a Player from Database

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `DELETE FROM cricket_team 
    WHERE player_id=${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;

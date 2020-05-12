import express from "express";
import bodyParser from "body-parser";


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("SERVER_ID", process.env.SERVER_ID || 167); // need to parametrize that as query or param
const ogameAPI = {
    alliances:      `https://s${app.get("SERVER_ID")}-pl.ogame.gameforge.com/api/alliances.xml`,    //Updateinterval 1 day
    highscore:      `https://s${app.get("SERVER_ID")}-pl.ogame.gameforge.com/api/highscore.xml`,    //Updateinterval 1 hour
    localization:   `https://s${app.get("SERVER_ID")}-pl.ogame.gameforge.com/api/localization.xml`, //Updateinterval 1 day
    playerData:     `https://s${app.get("SERVER_ID")}-pl.ogame.gameforge.com/api/playerData.xml`,   //Updateinterval 1 week
    players:        `https://s${app.get("SERVER_ID")}-pl.ogame.gameforge.com/api/players.xml`,      //Updateinterval 1 day
    serverData:     `https://s${app.get("SERVER_ID")}-pl.ogame.gameforge.com/api/serverData.xml`,   //Updateinterval 1 day
    universe:       `https://s${app.get("SERVER_ID")}-pl.ogame.gameforge.com/api/universe.xml`,     //Updateinterval 1 week
    universes:      `https://s${app.get("SERVER_ID")}-pl.ogame.gameforge.com/api/universes.xml`
};
app.set("ogameAPI", ogameAPI);
app.set("json spaces", 2);

app.use("/api", require("./src/api"));

const PORT = process.env.PORT || 2137;
app.listen(PORT, () => 
    console.log("\x1b[35m%s\x1b[0m", `[server] Server running on port: ${PORT}\n[server] ${new Date()}`));
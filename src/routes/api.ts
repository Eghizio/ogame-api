import { Router } from "express";
import { AlliancesController } from "../controllers/alliances";
import { HighscoreController } from "../controllers/highscore";
import { LocalizationController } from "../controllers/localization";
import { PlayerDataController } from "../controllers/playerData";
import { PlayersController } from "../controllers/players";
import { ServerDataController } from "../controllers/serverData";
import { UniverseController } from "../controllers/universe";
import { UniversesController } from "../controllers/universes";
import { cache } from "../middlewares/cache";
import { TIME_MS } from "../constants/time";


export const api = Router();


api.get("/", (req, res) => {
    return res.json({
        current: "/api",
        next: [
            "/api/alliances",
            "/api/highscore",
            "/api/localization",
            "/api/playerData",
            "/api/players",
            "/api/serverData",
            "/api/universe",
            "/api/universes",
        ]
    });
});

api.get("/alliances", cache(TIME_MS.TEN_SECONDS), AlliancesController.getAlliances);

api.get("/highscore", HighscoreController.getHighscoreLegend);
api.get("/highscore/players", cache(TIME_MS.TEN_SECONDS), HighscoreController.getHighscorePlayers);
api.get("/highscore/alliances", cache(TIME_MS.TEN_SECONDS), HighscoreController.getHighscoreAlliances);

api.get("/localization", cache(TIME_MS.TEN_SECONDS), LocalizationController.getLocalization);

api.get("/playerData", cache(TIME_MS.TEN_SECONDS), PlayerDataController.getPlayerData);

api.get("/players", cache(TIME_MS.TEN_SECONDS), PlayersController.getPlayers);

api.get("/serverData", cache(TIME_MS.TEN_SECONDS), ServerDataController.getServerData);

api.get("/universe", cache(TIME_MS.TEN_SECONDS), UniverseController.getUniverse);

api.get("/universes", cache(TIME_MS.TEN_SECONDS), UniversesController.getUniverses);
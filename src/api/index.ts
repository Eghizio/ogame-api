// "/api/highscore"
import express from "express";
import { alliancesRouter } from "./alliances";
import { highscoreRouter } from "./highscore";
import { localizationRouter } from "./localization";
import { playerDataRouter } from "./playerData";
import { playersRouter } from "./players";
import { serverDataRouter } from "./serverData";
import { universeRouter } from "./universe";
import { universesRouter } from "./universes";



export const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
    const Tree = {
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
    };

    res.json(Tree);
});

apiRouter.use("/alliances", alliancesRouter);
apiRouter.use("/highscore", highscoreRouter);
apiRouter.use("/localization", localizationRouter);
apiRouter.use("/playerData", playerDataRouter);
apiRouter.use("/players", playersRouter);
apiRouter.use("/serverData", serverDataRouter);
apiRouter.use("/universe", universeRouter);
apiRouter.use("/universes", universesRouter);

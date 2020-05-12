// "/api/highscore"
import express from "express";


const router = express.Router();

router.get("/", (req, res) => {
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

router.use("/alliances", require("./alliances"));
router.use("/highscore", require("./highscore"));
router.use("/localization", require("./localization"));
router.use("/playerData", require("./playerData"));
router.use("/players", require("./players"));
router.use("/serverData", require("./serverData"));
router.use("/universe", require("./universe"));
router.use("/universes", require("./universes"));


module.exports = router;
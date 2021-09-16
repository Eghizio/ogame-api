// "/api/highscore"
import express from "express";
import fetch from "node-fetch";
import { cache } from "../middlewares/cache";
import { XMLParserService } from "../services/XMLParserService";
import { OGAME_API_ENDPOINTS, TEMP_SERVER_ID } from "../constants/endpoints";


export const highscoreRouter = express.Router();


highscoreRouter.get("/", (req, res) => {
    const guide = {
        example: "/api/highscore/players?type=0",
        category: ["players", "alliances"],
        type: {
            0: "Total",
            1: "Economy",
            2: "Research",
            3: "Military",
            4: "Military Built",
            5: "Military Destroyed",
            6: "Military Lost",
            7: "Honor"
        }
    };

    res.json(guide);
});


highscoreRouter.get("/players", cache(0), (req, res) => {

    const { query: q } = req;
    const type = (q.type && (Number(q.type) >= 0 && Number(q.type) <= 7)) ? q.type : "0";


    const URL = OGAME_API_ENDPOINTS.highscore(TEMP_SERVER_ID) + "?category=1&type=" + type;

    fetch(URL)
        .then(response => response.text())
        .then(xml => new XMLParserService().parseToJson(xml))
        .then(json => {
            const orderedJSON = {
                serverID: json.highscore.$.serverId,
                timestamp: json.highscore.$.timestamp,
                category: json.highscore.$.category,
                type: json.highscore.$.type,
                players: [...json.highscore.player.map((a: any) => a.$)]
            };

            return orderedJSON;
        })
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
});

highscoreRouter.get("/alliances", cache(0), (req, res) => {

    const { query: q } = req;
    const type = (q.type && (Number(q.type) >= 0 && Number(q.type) <= 7)) ? q.type : "0";

    const URL = OGAME_API_ENDPOINTS.highscore(TEMP_SERVER_ID) + "?category=2&type=" + type;
    fetch(URL)
        .then(response => response.text())
        .then(xml => new XMLParserService().parseToJson(xml))
        .then(json => {
            const orderedJSON = {
                serverID: json.highscore.$.serverId,
                timestamp: json.highscore.$.timestamp,
                category: json.highscore.$.category,
                type: json.highscore.$.type,
                alliances: [...json.highscore.alliance.map((a: any) => a.$)]
            };

            return orderedJSON;
        })
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
});

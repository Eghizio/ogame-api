// "/api/players"
import express from "express";
import fetch from "node-fetch";
import { CacheService } from "../services/CacheService";
import { XMLParserService } from "../services/XMLParserService";
import { OGAME_API_ENDPOINTS, TEMP_SERVER_ID } from "../constants/endpoints";
import { Players } from "../types/api";


export const playersRouter = express.Router();
const cache = new CacheService();

playersRouter.get("/", (req, res) => {
    // console.log(`Calling "${req.originalUrl}"...`); // need to npm morgan for logs

    if(cache.has(req.originalUrl))
        return res.json(cache.get(req.originalUrl));

    const URL = OGAME_API_ENDPOINTS.players(TEMP_SERVER_ID);

    fetch(URL)
        .then(response => response.text())
        .then(xml => new XMLParserService().parseToJson(xml))
        .then(json => {
            const orderedJSON: Players = {
                serverID: json.players.$.serverId,
                timestamp: json.players.$.timestamp,
                players: [...json.players.player.map((p: any) => p.$)]
            };

            return orderedJSON;
        })
        .then(data => cache.set(req.originalUrl, data))
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
});

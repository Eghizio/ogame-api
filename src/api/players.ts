// "/api/players"
import { Players } from "../types/api";
import express from "express";
import axios from "axios";
import CacheService from "../services/CacheService";
import XMLParserService from "../services/XMLParserService";


const router = express.Router();
const cache = new CacheService();

router.get("/", (req, res) => {
    // console.log(`Calling "${req.originalUrl}"...`); // need to npm morgan for logs

    if(cache.has(req.originalUrl))
        return res.json(cache.get(req.originalUrl));

    axios.get(req.app.get("ogameAPI").players)
        .then(response => response.data)
        .then(xml => new XMLParserService().parse(xml))
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


module.exports = router;
// "/api/players"
import { Players } from "../types/api";
import express from "express";
import axios from "axios";
import { Parser } from "xml2js";
import CacheService from "../services/CacheService";


const router = express.Router();
const cache = new CacheService();

router.get("/", (req, res) => {
    // console.log(`Calling "${req.baseUrl}"...`); // need to npm morgan for logs

    if(cache.has(req.baseUrl))
        return res.json(cache.get(req.baseUrl));

    const XML_Parser = new Parser();

    axios.get(req.app.get("ogameAPI").players)
        .then(response => response.data)
        .then(xml => 
            XML_Parser.parseStringPromise(xml)
                .catch(err => console.log("Error parsing XML ", err))
                .then(parsedXML => parsedXML))
        .then(json => {
            const orderedJSON: Players = {
                serverID: json.players.$.serverId,
                timestamp: json.players.$.timestamp,
                players: [...json.players.player.map((p: any) => p.$)]
            };

            return orderedJSON;
        })
        .then(data => cache.set(req.baseUrl, data))
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
});


module.exports = router;
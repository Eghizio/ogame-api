// "/api/universes"
import express from "express";
import fetch from "node-fetch";
import { XMLParserService } from "../services/XMLParserService";
import { CacheService } from "../services/CacheService";
import { OGAME_API_ENDPOINTS, TEMP_SERVER_ID } from "../constants/endpoints";
import { Universes } from "../types/api";


export const universesRouter = express.Router();
const cache = new CacheService();

universesRouter.get("/", (req, res) => {
    
    if(cache.has(req.originalUrl))
        return res.json(cache.get(req.originalUrl));

    const URL = OGAME_API_ENDPOINTS.universes(TEMP_SERVER_ID);
        
    fetch(URL)
        .then(response => response.text())
        .then(xml => new XMLParserService().parseToJson(xml))
        .then(json => {
            const orderedJSON: Universes = {
                serverID: json.universes.$.serverId,
                timestamp: json.universes.$.timestamp,
                universes: [...json.universes.universe.map((u: any) => u.$)]
            };

            return orderedJSON;
        })
        .then(data => cache.set(req.originalUrl, data))
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
});

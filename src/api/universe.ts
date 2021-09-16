// "/api/universe"
import express from "express";
import fetch from "node-fetch";
import { XMLParserService } from "../services/XMLParserService";
import { CacheService } from "../services/CacheService";
import { OGAME_API_ENDPOINTS, TEMP_SERVER_ID } from "../constants/endpoints";
import { Universe } from "../types/api";


export const universeRouter = express.Router();
const cache = new CacheService();

universeRouter.get("/", (req, res) => {
    
    if(cache.has(req.originalUrl))
        return res.json(cache.get(req.originalUrl));

    const URL = OGAME_API_ENDPOINTS.universe(TEMP_SERVER_ID);
        
    fetch(URL)
        .then(response => response.text())
        .then(xml => new XMLParserService().parseToJson(xml))
        .then(json => {
            const orderedJSON: Universe = {
                serverID: json.universe.$.serverId,
                timestamp: json.universe.$.timestamp,
                planets: [
                    ...json.universe.planet.map((p: any) =>
                        ({  
                            name: p.$.name, player: p.$.player, coords: p.$.coords, id: p.$.id,
                            ...(p.moon && {moon: { name: p.moon[0].$.name, size: p.moon[0].$.size, id: p.moon[0].$.id }})
                        })
                    )
                ]
            };

            return orderedJSON;
        })
        .then(data => cache.set(req.originalUrl, data))
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
});

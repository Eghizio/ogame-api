// "/api/alliances"
import express from "express";
import fetch from "node-fetch";
import { XMLParserService } from "../services/XMLParserService";
import { CacheService } from "../services/CacheService";
import { OGAME_API_ENDPOINTS, TEMP_SERVER_ID } from "../constants/endpoints";
import { Alliances } from "../types/api";


export const alliancesRouter = express.Router();
const cache = new CacheService();

alliancesRouter.get("/", (req, res) => {

    if(cache.has(req.originalUrl))
        return res.json(cache.get(req.originalUrl));

    fetch(OGAME_API_ENDPOINTS.alliances(TEMP_SERVER_ID))
        .then(response => response.text())
        .then(xml => new XMLParserService().parseToJson(xml))
        .then(json => {
            const orderedJSON: Alliances = {
                serverID: json.alliances.$.serverId,
                timestamp: json.alliances.$.timestamp,
                alliances: [
                    ...json.alliances.alliance.map((a: any) => 
                        ({ 
                            id: a.$.id, 
                            name: a.$.name,
                            tag: a.$.tag,
                            founder: a.$.founder,
                            foundDate: a.$.foundDate,
                            ...(a.$.logo && {logo: a.$.logo}),
                            ...(a.$.open && { open: true }),
                            ...(a.player && {players: a.player.map((p: any) => p.$)})
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

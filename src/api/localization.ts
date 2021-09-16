// "/api/localization"
import express from "express";
import fetch from "node-fetch";
import { XMLParserService } from "../services/XMLParserService";
import { CacheService } from "../services/CacheService";
import { OGAME_API_ENDPOINTS, TEMP_SERVER_ID } from "../constants/endpoints";
import { Localization } from "../types/api";


export const localizationRouter = express.Router();
const cache = new CacheService();

localizationRouter.get("/", (req, res) => {
    
    if(cache.has(req.originalUrl))
        return res.json(cache.get(req.originalUrl));
        
    const URL = OGAME_API_ENDPOINTS.localization(TEMP_SERVER_ID);

    fetch(URL)
        .then(response => response.text())
        .then(xml => new XMLParserService().parseToJson(xml))
        .then(json => {
            const orderedJSON: Localization = {
                serverID: json.localization.$.serverId,
                timestamp: json.localization.$.timestamp,
                buildings: [],
                research: [],
                ships: [],
                defense: [],
                officers: [],
                missions: [
                    ...json.localization.missions[0].name.map((m: any) => 
                        ({ name: m._, id: m.$.id })
                    )
                ]
            };
            
            json.localization.techs[0].name.map((t: any) => ({ name: t._, id: t.$.id }))
            .forEach((t: any) => {
                //a lot of ifs, cause why the fuck not 
                if(t.id <100)
                    orderedJSON.buildings.push(t);
                if(t.id>100 && t.id <200)
                    orderedJSON.research.push(t);
                if(t.id>200 && t.id <300)
                    orderedJSON.ships.push(t);
                if(t.id>400 && t.id <600)
                    orderedJSON.defense.push(t);
                if(t.id>1000)
                    orderedJSON.officers.push(t);
            });

            return orderedJSON;
        })
        .then(data => cache.set(req.originalUrl, data))
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
});

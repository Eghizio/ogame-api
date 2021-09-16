// "/api/serverData"
import express from "express";
import fetch from "node-fetch";
import { XMLParserService } from "../services/XMLParserService";
import { CacheService } from "../services/CacheService";
import { OGAME_API_ENDPOINTS, TEMP_SERVER_ID } from "../constants/endpoints";


export const serverDataRouter = express.Router();
const cache = new CacheService();

serverDataRouter.get("/", (req, res) => {
    
    if(cache.has(req.originalUrl))
        return res.json(cache.get(req.originalUrl));
        
    const URL = OGAME_API_ENDPOINTS.serverData(TEMP_SERVER_ID);
    
    fetch(URL)
        .then(response => response.text())
        .then(xml => new XMLParserService().parseToJson(xml))
        .then(json => {
            const orderedJSON = {
                serverID: json.serverData.$.serverId,
                timestamp: json.serverData.$.timestamp,
            };

            delete json.serverData.$;
            for(const key of Object.keys(json.serverData)){
                Object.assign(orderedJSON, {[key]: json.serverData[key][0]})
            }

            return orderedJSON;
        })
        .then(data => cache.set(req.originalUrl, data))
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
});

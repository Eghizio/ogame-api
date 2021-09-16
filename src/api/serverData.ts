// "/api/serverData"
import express from "express";
import fetch from "node-fetch";
import { cache } from "../middlewares/cache";
import { XMLParserService } from "../services/XMLParserService";
import { OGAME_API_ENDPOINTS, TEMP_SERVER_ID } from "../constants/endpoints";


export const serverDataRouter = express.Router();

serverDataRouter.get("/", cache(0), (req, res) => {
        
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
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
});

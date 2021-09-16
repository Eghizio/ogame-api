// "/api/serverData"
import { RequestHandler } from "express";
import fetch from "node-fetch";
import { XMLParserService } from "../services/XMLParserService";
import { OGAME_API_ENDPOINTS, TEMP_SERVER_ID } from "../constants/endpoints";


const getServerData: RequestHandler = (req, res) => {
        
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
};


export const ServerDataController = {
    getServerData,
};
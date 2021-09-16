// "/api/serverData"
import { RequestHandler } from "express";
import fetch from "node-fetch";
import { XMLParserService } from "../services/XMLParserService";
import { OGAME_API_ENDPOINTS, TEMP_SERVER_ID } from "../constants/endpoints";


const getServerData: RequestHandler = async (req, res) => {

    try{
        const URL = OGAME_API_ENDPOINTS.serverData(TEMP_SERVER_ID);

        const response = await fetch(URL);
        const xml = await response.text();
        const json = await new XMLParserService().parseToJson(xml);

        const orderedJSON = {
            serverID: json.serverData.$.serverId,
            timestamp: json.serverData.$.timestamp,
        };

        delete json.serverData.$; //gotta refactor this to some destructuring or mapping funcs
        for(const key of Object.keys(json.serverData)){
            Object.assign(orderedJSON, {[key]: json.serverData[key][0]})
        }

        return res.status(200).json(orderedJSON);
    }
    catch(error){
        return res.status(500).send(error);
    }
};


export const ServerDataController = {
    getServerData,
};
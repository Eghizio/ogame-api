// "/api/serverData"
import express from "express";
import axios from "axios";
import XMLParserService from "../services/XMLParserService";


const router = express.Router();

router.get("/", (req, res) => {
    
    axios.get(req.app.get("ogameAPI").serverData)
        .then(response => response.data)
        .then(xml => new XMLParserService().parse(xml))
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


module.exports = router;
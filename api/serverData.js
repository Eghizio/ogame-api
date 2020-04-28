// "/api/serverData"
const express = require("express");
const axios = require("axios");
const { Parser } = require("xml2js");


const router = express.Router();

router.get("/", (req, res) => {
    const XML_Parser = new Parser();
    
    axios.get(req.app.get("ogameAPI").serverData)
        .then(response => response.data)
        .then(xml => 
            XML_Parser.parseStringPromise(xml)
                .catch(err => console.log("Error parsing XML ", err))
                .then(parsedXML => parsedXML))
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
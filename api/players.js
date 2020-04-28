// "/api/players"
const express = require("express");
const axios = require("axios");
const { Parser } = require("xml2js");


const router = express.Router();

router.get("/", (req, res) => {
    const XML_Parser = new Parser();
    
    axios.get(req.app.get("ogameAPI").players)
        .then(response => response.data)
        .then(xml => 
            XML_Parser.parseStringPromise(xml)
                .catch(err => console.log("Error parsing XML ", err))
                .then(parsedXML => parsedXML))
        .then(json => {
            const orderedJSON = {
                serverID: json.players.$.serverId,
                timestamp: json.players.$.timestamp,
                players: [...json.players.player.map(({$}) => $)]
            };

            return orderedJSON;
        })
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
});


module.exports = router;
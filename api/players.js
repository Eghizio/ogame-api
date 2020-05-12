// "/api/players"
const express = require("express");
const axios = require("axios");
const { Parser } = require("xml2js");
const Cache = require("../utils/Cache");

const router = express.Router();
const cache = new Cache();

router.get("/", (req, res) => {
    // Need to move logs to cache, prolly will swap to use node-cache behind the Cache class
    // Need to create services and extract the logic
    console.log(`Calling "${req.baseUrl}"...`);

    if(cache.has(req.baseUrl)){
        console.log(`Retrieving "${req.baseUrl}" from cache...`);
        return res.json(cache.get(req.baseUrl));
    }

    console.log(`No cache item found for ${req.baseUrl}`);

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
        .then(data => cache.set(req.baseUrl, data))
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
});


module.exports = router;
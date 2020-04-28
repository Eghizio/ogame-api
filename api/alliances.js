// "/api/alliances"
const express = require("express");
const axios = require("axios");
const { Parser } = require("xml2js");


const router = express.Router();

router.get("/", (req, res) => {
    const XML_Parser = new Parser();
    
    axios.get(req.app.get("ogameAPI").alliances)
        .then(response => response.data)
        .then(xml => 
            XML_Parser.parseStringPromise(xml)
                .catch(err => console.log("Error parsing XML ", err))
                .then(parsedXML => parsedXML))
        .then(json => {
            const orderedJSON = {
                serverID: json.alliances.$.serverId,
                timestamp: json.alliances.$.timestamp,
                alliances: [
                    ...json.alliances.alliance.map(a => 
                        ({ 
                            id: a.$.id, 
                            name: a.$.name,
                            tag: a.$.tag,
                            founder: a.$.founder,
                            foundDate: a.$.foundDate,
                            logo: a.$.logo,
                            ...(a.$.open && { open: true }),
                            ...(a.player && {players: a.player.map(p => p.$)})
                        })
                    )
                ]
            };

            return orderedJSON;
        })
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
});


module.exports = router;
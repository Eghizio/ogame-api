// "/api/universe"
const express = require("express");
const axios = require("axios");
const { Parser } = require("xml2js");


const router = express.Router();

router.get("/", (req, res) => {
    const XML_Parser = new Parser();
    
    axios.get(req.app.get("ogameAPI").universe)
        .then(response => response.data)
        .then(xml => 
            XML_Parser.parseStringPromise(xml)
                .catch(err => console.log("Error parsing XML ", err))
                .then(parsedXML => parsedXML))
        .then(json => {
            const orderedJSON = {
                serverID: json.universe.$.serverId,
                timestamp: json.universe.$.timestamp,
                planets: [
                    ...json.universe.planet.map(p =>
                        ({  
                            name: p.$.name, player: p.$.player, coords: p.$.coords, id: p.$.id,
                            ...(p.moon && {moon: { name: p.moon[0].$.name, size: p.moon[0].$.size, id: p.moon[0].$.id }})
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
// "/api/playerData"
const express = require("express");
const axios = require("axios");
const { Parser } = require("xml2js");


const router = express.Router();

// TODO highscore and alliance (test for id=[1, 100013, 101421])
router.get("/", (req, res) => {
    const XML_Parser = new Parser();

    const { query: q } = req;
    const id = q.id ? q.id : "1";
    
    axios.get(req.app.get("ogameAPI").playerData +"?id="+ id)
        .then(response => response.data)
        .then(xml => 
            XML_Parser.parseStringPromise(xml)
                .catch(err => console.log("Error parsing XML ", err))
                .then(parsedXML => parsedXML))
        .then(json => {
            const orderedJSON = {
                serverID: json.playerData.$.serverId,
                timestamp: json.playerData.$.timestamp,
                player: {
                    id: json.playerData.$.id,
                    name: json.playerData.$.name,
                    ...(json.playerData.positions[0] && {
                        highscore: [
                            ...json.playerData.positions[0].position.map(h =>
                                ({ type: h.$.type, rank: h._, points: h.$.score, ships: h.$.ships })
                            )
                        ]
                    }),
                    planets: [
                        ...json.playerData.planets[0].planet.map(p =>
                            ({  
                                name: p.$.name, coords: p.$.coords, id: p.$.id,
                                ...(p.moon && {
                                     moon: { name: p.moon[0].$.name, size: p.moon[0].$.size, id: p.moon[0].$.id }
                                })
                            })
                        )
                    ],
                    ...(json.playerData.alliance && {
                        alliance: {
                            name: json.playerData.alliance[0].name[0],
                            tag: json.playerData.alliance[0].tag[0],
                            id: json.playerData.alliance[0].$.id
                        }
                    })
                }
            };

            return orderedJSON;
        })
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
});


module.exports = router;
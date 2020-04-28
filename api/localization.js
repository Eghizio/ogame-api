// "/api/localization"
const express = require("express");
const axios = require("axios");
const { Parser } = require("xml2js");


const router = express.Router();

router.get("/", (req, res) => {
    const XML_Parser = new Parser();
    
    axios.get(req.app.get("ogameAPI").localization)
        .then(response => response.data)
        .then(xml => 
            XML_Parser.parseStringPromise(xml)
                .catch(err => console.log("Error parsing XML ", err))
                .then(parsedXML => parsedXML))
        .then(json => {
            const orderedJSON = {
                serverID: json.localization.$.serverId,
                timestamp: json.localization.$.timestamp,
                buildings: [],
                research: [],
                ships: [],
                defense: [],
                officers: [],
                missions: [
                    ...json.localization.missions[0].name.map(m => 
                        ({ name: m._, id: m.$.id })
                    )
                ]
            };
            
            json.localization.techs[0].name.map(t => ({ name: t._, id: t.$.id }))
            .forEach(t => {
                //a lot of ifs, cause why the fuck not 
                if(t.id <100)
                    orderedJSON.buildings.push(t);
                if(t.id>100 && t.id <200)
                    orderedJSON.research.push(t);
                if(t.id>200 && t.id <300)
                    orderedJSON.ships.push(t);
                if(t.id>400 && t.id <600)
                    orderedJSON.defense.push(t);
                if(t.id>1000)
                    orderedJSON.officers.push(t);
            });

            return orderedJSON;
        })
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
});


module.exports = router;
// "/api/localization"
import { Localization } from "../types/api";
import express from "express";
import axios from "axios";
import { Parser } from "xml2js";


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
            const orderedJSON: Localization = {
                serverID: json.localization.$.serverId,
                timestamp: json.localization.$.timestamp,
                buildings: [],
                research: [],
                ships: [],
                defense: [],
                officers: [],
                missions: [
                    ...json.localization.missions[0].name.map((m: any) => 
                        ({ name: m._, id: m.$.id })
                    )
                ]
            };
            
            json.localization.techs[0].name.map((t: any) => ({ name: t._, id: t.$.id }))
            .forEach((t: any) => {
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
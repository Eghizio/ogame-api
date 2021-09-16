import { Parser } from "xml2js";


export class XMLParserService{
    XML_Parser: Parser
    constructor(){
        this.XML_Parser = new Parser();
    }
    
    async parseToJson(xml: any){
        const parsed = await this.XML_Parser.parseStringPromise(xml)
            .catch((err: Error) => console.log("Error parsing XML ", err))
            .then(parsedXML => parsedXML);
        
        return parsed;
    }   
}

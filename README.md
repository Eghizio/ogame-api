# OGame API
This Node project is an API parser for Gameforge's browser game OGame. 

The original API is in XML format while JSON is more convenient and commonly used.
My application calls the original endpoint and parses the XML data into JSON format,
and returns the rearranged data via custom endpoint. 

Can be used for analytic purposes to build customized tools although be aware that it is __not real-time data__.

**Update intervals** for each endpoint can be found at `server.js`

## Installation
>`npm install`
## Run:
>`npm start`

## Available endpoints
+ /api/**alliances**
+ /api/**highscore**
+ /api/**localization**
+ /api/**playerData**
+ /api/**players**
+ /api/**serverData**
+ /api/**universe**
+ /api/**universes**

## License
This project was created by [Jakub "Eghizio" Wąsik](https://github.com/Eghizio) and is open source software licensed as ISC.

const express = require("express");
const router = express.Router();
fs = require('fs');
var path = require('path');
const axios = require('axios');

const models = require("../models");

router.get('/', (req, res) => {
  //For testing, send to the /delivery endpoint after read JSON file (log.json for the mockup data)
  var jsonPath = path.join(__dirname, '..', 'log.json');
  // Instead of fs.readFile function, to getting the real data from outside endpoint, 
  // need to add outside endpoint here.
  try{
    fs.readFile(jsonPath, 'utf8', async function (err,data) {
        if (err) {
            return res.send(err)
        }
        try{
            let payload = JSON.parse(data);
            const request = await axios.post(process.env.BASE_URL + "/api/user/deliveryorder", payload, { headers: {'Content-Type': 'application/json'} }); 
        }catch(error){
            
        }

        //axios post to deliveryorder endpoint
        return res.send(data)
        
      });
  }catch(error){
    res.send(error)
  }
})

module.exports = router;

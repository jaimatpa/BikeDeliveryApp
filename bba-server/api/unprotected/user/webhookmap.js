const express = require("express");
const router = express.Router();
const status = require("http-status");
const { Op } = require("sequelize");

const models = require("../../../models");
const apiError = require("../../../libs/apiError");
const constVariables = require("../../../constants");
const apiMessage = require("../../../language/en.json");


router.post("/", async (req, res) => {

    const data = JSON.parse(JSON.stringify(req.body));
    for(let i =0;i<data.length;i++){
        // const d = models.Web
        const d = await models.WebhookMaps.findOne({
            where:{
                table_key:data[i].table_key
            }
        });
        if(d){
            d.json_key = data[i].json_key;
            await d.save();
        }else{
            await models.WebhookMaps.build(data[i]).save();
        }
        
    }
    //received the json here req.body
    // console.log(req.body)
    res.send(req.body);
});

router.get("/", async (req, res) => {
   const data = models.WebhookMap.findAll();
    return res.send(data);
});

module.exports = router;

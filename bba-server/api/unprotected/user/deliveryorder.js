const express = require("express");
const router = express.Router();
const status = require("http-status");
const { Op } = require("sequelize");

const models = require("./../../../models");
const apiError = require("./../../../libs/apiError");
const constVariables = require("./../../../constants");
const apiMessage = require("./../../../language/en.json");


router.post("/", async (req, res) => {

    const data = JSON.parse(JSON.stringify(req.body));
    const keys = await models.WebhookMaps.findAll();

    for(let i =0;i<data.length;i++){
        let d = data[i];
        for(let k=0;k<keys.length;k++){
            const json_key = keys[k].json_key;
            const table_key = keys[k].table_key;
            if(json_key !== table_key && d[json_key]){
                d[table_key] = d[json_key]
                delete d[json_key]
            }
        }
        console.log(d)
        await models.DeliveryOrders.build(d).save();
    }
    //received the json here req.body
    // console.log(req.body)
    res.send(req.body);
});

router.get("/", async (req, res) => {
    let data = [];
    const search = req.query.search;
    const barcodeid = req.query.barcodeid;
    if(search){
        try{
            data = await models.DeliveryOrders.findAll({
                where:{
                    [Op.or]:{
                        name: {
                            [Op.like]: `%${search}%`
                        },
                        location: {
                            [Op.like]: `%${search}%`
                        },
                        orderid: {
                            [Op.like]: `%${search}%`
                        },
                        rack: {
                            [Op.like]: `%${search}%`
                        },
                        color: {
                            [Op.like]: `%${search}%`
                        },
                        combination: {
                            [Op.like]: `%${search}%`
                        },
                        lock: {
                            [Op.like]: `%${search}%`
                        },
                        mobileNo: {
                            [Op.like]: `%${search}%`
                        },
                        barcode: {
                            [Op.like]: `%${search}%`
                        }

                    }
                    
                    
                }
            });
            console.log(data)
        }catch(error){
            console.log(error)
        }
    }else if(barcodeid){
        if(barcodeid){
            try{
                data = await models.DeliveryOrders.findAll({
                    where:{
                        barcode: {
                            [Op.like]: `%${barcodeid}%`
                        }
                    }
                });
                console.log(data)
            }catch(error){
                console.log(error)
            }
        }
    }
    else{
        data = await models.DeliveryOrders.findAll();
    }
    return res.send(data);
});

module.exports = router;

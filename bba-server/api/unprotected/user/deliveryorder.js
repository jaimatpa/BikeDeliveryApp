const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

const models = require("./../../../models");

router.post("/", async (req, res) => {
    
    try{
        await models.Logs.build({json:JSON.stringify(req.body)}).save();
    }catch(error){
        console.log(error)
    }

    try{
        const data = JSON.parse(JSON.stringify(req.body)).data;
        const keys = await models.WebhookMaps.findAll();
        let d = data;
        for(let k=0;k<keys.length;k++){
            const json_key = keys[k].json_key;
            const table_key = keys[k].table_key;
            const temp = iterate(d, json_key);
            if(json_key !== table_key && temp !== 'undefined'){
                d[table_key] = temp
            }
            await models.DeliveryOrders.build(d).save();
        }
    }catch(error){
        console.log(error)
    }
    
    //received the json here req.body
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
                    status:0,
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
                        status:0,
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
        data = await models.DeliveryOrders.findAll({where:{status:0}});
    }
    return res.send(data);
});

module.exports = router;

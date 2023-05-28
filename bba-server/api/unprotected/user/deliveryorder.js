const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const moment = require("moment");

const models = require("./../../../models");
const { RecordingSettingsContext } = require("twilio/lib/rest/video/v1/recordingSettings");

router.post("/", async (req, res) => {
    
    try{
        await models.Logs.build({json:JSON.stringify(req.body)}).save();
    }catch(error){
       // console.log(error)
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
        //console.log(error)
    }
    
    //received the json here req.body
    res.send(req.body);
});

router.get("/", async (req, res) => {
    let data = [];
    const search = req.query.search;
    const type = req.query.type;
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
            if (type === "DeliveryOrders") {
                data = data.filter((record => {
                    var d = moment(record.date).add(4, 'hours').startOf('day');
                    var today = moment().endOf('day');
                    if (d >= today && record.status == 0) {
                        return true;
                    } else {
                        return false;
                    }
                }));
            }
            else if (type === "Locking") {
                data = data.filter((record => {
                    var d = moment(record.date).add(4, 'hours').format('LL');
                    var today = moment().format('LL');
                    if (d >= today) {
                        return true;
                    } else {
                        return false;
                    }
                }));
            } else if (type === "SearchHistory") {
                data = data.filter((record => {
                    return true;
                }));
            } else if (type === "Dashboard") {
                data = data.filter((record => {
                    var d = moment(record.date).add(4, 'hours').format('LL');
                    var today = moment().format('LL');
                    if (d == today) {
                        return true;
                    } else {
                        return false;
                    }
                }));
            } else if (type === "Resend") {
                data = data.filter((record => {
                    var d = moment(record.date).add(4, 'hours').format('LL');
                    var today = moment().format('LL');
                    if (d > today && record.status == 1) {
                        return true;
                    } else {
                        return false;
                    }
                }));
            } else if (type === "Logistics") {
                data = data.filter((record => {
                    var d = moment(record.date).add(4, 'hours').format('LL');
                    var today = moment().format('LL');
                    if (d >= today && record.status == 0) {
                        return true;
                    } else {
                        return false;
                    }
                }));
            } else if (type === "Pickup") {
                data = data.filter((record => {
                    if (record.status == 1 && record.PickedUp == 0) {
                        return true;
                    } else {
                        return false;
                    }
                }));
            } 
        }catch(error){
            console.log(error)
        }
    }
    else if(barcodeid){
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
            }catch(error){
                return Promise.reject();
            }
        }
    }
    else{
        data = await models.DeliveryOrders.findAll().catch((e) => {
            console.error(e);
            data = [];
            return res.send([]);
        });
        if (type === "DeliveryOrders") {
            data = data.filter((record => {
                var d = moment(record.date).add(4, 'hours').startOf('day');
                var today = moment().endOf('day');
                if (d >= today && record.status == 0) {
                    return true;
                } else {
                    return false;
                }
            }));
        } else if (type === "Locking") {
            data = data.filter((record => {
                var d = moment(record.date).add(4, 'hours').startOf('day').format('LL');
                var today = moment().format('LL');
                if (d >= today) {
                    return true;
                } else {
                    return false;
                }
            }));
        } else if (type === "SearchHistory") {
            data = data.filter((record => {
                console.log("SEARCH HISTORY, NO CRITERIA");
                return true;
            }));
        } else if (type === "Dashboard") {
            //console.log("In Dashboard");
            data = data.filter((record => {
                var d = moment(record.date).add(4, 'hours').format("LL");
                var today = moment().format("LL");
                if (d == today) {
                    return true;
                } else {
                    return false;
                }
            }));
        } else if (type === "Resend") {
            data = data.filter((record => {
                var d = moment(record.date).add(4, 'hours').startOf('LL');
                var today = moment().format('LL');
                if (d > today && record.status == 1) {
                    return true;
                } else {
                    return false;
                }
            }));
        } else if (type === "Logistics") {
            data = data.filter((record => {
                var d = moment(record.date).add(4, 'hours').startOf('day');
                var today = moment().endOf('day');
                if (d >= today && record.status == 0) {
                    return true;
                } else {
                    return false;
                }
            }));
        } else if (type === "Pickup") {
            data = data.filter((record => {
                var d = moment(record.date).add(4, 'hours').format('LL');
                var today = moment().format('LL');
                if (record.status == 1 && record.PickedUp == 0) {
                    return true;
                } else {
                    return false;
                }
            }));
        } 
    }
    try {
        return res.send(data);
    } catch (e) {
        // return res.send([]);
    }

});

router.put("/", async (req, res) => {
    try {
        const updateDO = await models.DeliveryOrders.update({
            truckID: req.body.truckID
        },
        {
        where: {
            id: req.body.id
        }
        });
        return res.send(updateDO);
    } catch (error) {
        //(error);
    }
});

module.exports = router;

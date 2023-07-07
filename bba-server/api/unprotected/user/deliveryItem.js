const express = require("express");
const router = express.Router();
const { Op, where } = require("sequelize");
const models = require("./../../../models");
const apiMessage = require("./../../../language/en.json");
const { sendNotification } = require("../../functions/notifications")

router.post("/", async (req, res) => {
    try {
        let existingItem = await models.DeliveryItem.findAll({
            where: {
                id: req.body.id,
            }
        });


        let newDeliveryItem = await models.DeliveryItem.create({
            deliveryID: existingItem[0].dataValues.deliveryID,
            item: existingItem[0].dataValues.item,
            serialbarcode: existingItem[0].dataValues.serialbarcode,
            Active: false,
            checkedDelievery: existingItem[0].dataValues.checkedDelievery,
            checkPickup: existingItem[0].dataValues.checkPickup
        })

        return res.send(newDeliveryItem);
    } catch (error) {
        console.log(error);
    }
});

router.post("/createEquipmentItemsSwapOrder", async (req, res) => {

    try {
        await models.Logs.build({ json: JSON.stringify(req.body) }).save();
    } catch (error) {
        // console.log(error)
    }

    try {
        const data = JSON.parse(JSON.stringify(req.body));
        data.forEach(async x=> {
            x.id = null;
            await models.DeliveryItem.build(x).save();
        });
        
        console.log(items);
        res.send(items);
    } catch (error) {
        res.send(error);
        console.log(error)
    }

    //received the json here req.body
    //res.send(req.body);
});


router.put("/", async (req, res) => { 
    try {
        console.log(req.body);
        let existingItem = await models.DeliveryItem.findAll({
            where: {
                id: req.body.id,
            }
        });

        const items = await models.DeliveryItem.findAll({
            where: {
                deliveryID: req.body.deliveryID
            }
        })

        console.log('items len = ', items.length)
        var count = items.length;
        var delivered = 1;
        items.forEach( item => {
            if(item.checkedDelievery) delivered++;
        });

        if(delivered >= count - 1) {
            console.log("All items have been delivered");
        }
        else {
            console.log(`Loading items ... ${delivered} / ${count}`);
        }

        const updateDeliveryItem = await models.DeliveryItem.update({
            checkedDelievery: req.body.checkedDelievery,
            checkPickup: req.body.checkPickup,
            serialbarcode: req.body.serialbarcode,
        },
        {
        where: {
            id: req.body.id
        }
        });


        return res.send(updateDeliveryItem);
    } catch (error) {
        console.log(error);
    }
});

router.delete("/", async (req, res) => {
    try {
        const deleteTruck = await models.Truck.destroy(
        {
        where: {
            id: req.body.itemID
        }
        });
        const response = {
            success: true,
            result: deleteTruck,
            message:
              "Truck was successfully found and deleted.",
          };
        return res.send(response);
    } catch (error) {
        console.log(error);
    }
});

router.get("/", async (req,res) => {
    try {
        let deliveryID = req.query.deliveryID;
        let data = [];
        if(typeof(deliveryID) == 'undefined')
        {
            return res.status(500).json("Error: You must provide a deliveryID");
        }
        
        data = await models.DeliveryItem.findAll({
            where: {
                DeliveryID: deliveryID,
                Active: true
            }
        });

        return res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).json("Error: " + error);
    }
});


router.get("/extras", async (req,res) => {
    try {
        let deliveryID = req.query.deliveryID;
        let data = [];

        data = await models.DeliveryExtras.findAll({
            where: {
                deliveryOrderId: deliveryID
            }
        });

        return res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).json("Error: " + error);
    }
});

module.exports = router;
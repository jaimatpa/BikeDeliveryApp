const express = require("express");
const router = express.Router();
const { Op, where } = require("sequelize");
const models = require("./../../../models");

router.post("/", async (req, res) => {
    try {
        console.log(req);
        const newAsset = await models.Asset.create({
            barcode: req.body.barcode,
            item: req.body.item,
            lastDelivery: req.body.lastDelivery,
            status: req.body.status,

        })
        return res.send(newAsset);
    } catch (error) {
        console.log(error);
    }
});

router.put("/", async (req, res) => {
    try {
        console.log(req);
        const updateAsset = await models.Asset.update({
            barcode: req.body.barcode,
            item: req.body.item,
            lastDelivery: req.body.lastDelivery,
            status: req.body.status,
        },
        {
        where: {
            id: req.body.itemID
        }
        });
        return res.send(updateAsset);
    } catch (error) {
        console.log(error);
    }
});

router.delete("/", async (req, res) => {
    try {
        const deleteAsset = await models.Asset.destroy(
        {
        where: {
            id: req.body.itemID
        }
        });
        const response = {
            success: true,
            result: deleteAsset,
            message:
              "Asset was successfully found and deleted.",
          };
        return res.send(response);
    } catch (error) {
        console.log(error);
    }
});

router.get("/", async (req,res) => {
    try {
        let data = [];
        data = await models.Asset.findAll({

        });
        return res.send(data);
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;
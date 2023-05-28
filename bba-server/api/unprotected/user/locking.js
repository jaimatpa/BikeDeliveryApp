const express = require("express");
const router = express.Router();
const status = require("http-status");
const { Op } = require("sequelize");

const models = require("./../../../models");

router.post("/", async (req,res) => {
    try{
        console.log(req.body);
        let locks = req.body;
        locks.forEach(lock => {
            const updateLock = models.Locks.update({
                color: lock.color,
                combination: lock.combination,
                ColorValue: lock.ColorValue,
            },
            {
            where: {
                id: lock.id
            }
            });
        });
        // const lock = await models.Locks.build(req.body);
        // await lock.save();
        return res.send(locks)
    }catch(error){
        return res.send(error)
    }
    
});

router.put("/", async (req, res) => {
    try {
        const updateLock = await models.Locks.update({
            color: req.body.color,
            combination: req.body.combination
        },
        {
        where: {
            id: req.body.id
        }
        });
        return res.send(updateLock);
    } catch (error) {
        console.log(error);
    }
});

router.delete("/", async (req, res) => {
    try {
        const deleteAsset = await models.Locks.destroy(
        {
        where: {
            id: req.body.id
        }
        });
        const response = {
            success: true,
            result: {deleteAsset},
            message:
              "Asset was successfully found and deleted.",
          };
        return res.send(response);
    } catch (error) {
        console.log(error);
    }
});

router.get("/", async (req,res) => {
    
    try{
        const lock = await models.Locks.findAll();
        return res.send(lock)
    }catch(error){
        return res.send(error)
    }
    
    
    
});

module.exports = router;

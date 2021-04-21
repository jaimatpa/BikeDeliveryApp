const express = require("express");
const router = express.Router();
const status = require("http-status");
const { Op } = require("sequelize");

const models = require("./../../../models");

router.post("/", async (req,res) => {
    
    try{
        const lock = await models.Locks.build(req.body);
        await lock.save();
        return res.send(lock)
    }catch(error){
        return res.send(error)
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

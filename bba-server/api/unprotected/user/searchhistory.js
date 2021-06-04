const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

const models = require("../../../models");

router.get("/", async (req, res) => {
    let data = [];
    const search = req.query.search;
    const barcodeid = req.query.barcodeid;
    if(search){
        console.log(search);
        try{
            data = await models.DeliveryOrders.findAll({
                where:{
                    status:1,
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
                        status:1,
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
        console.log(req);
        data = await models.DeliveryOrders.findAll({where:{status:1}});
    }
    return res.send(data);
});

module.exports = router;

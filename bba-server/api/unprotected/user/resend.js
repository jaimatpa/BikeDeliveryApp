const twilio = require("twilio");
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const { Op } = require("sequelize");
const express = require("express");
const cors = require('cors');
const router = express.Router();
const fs = require('fs');
router.use(cors());

const models = require("./../../../models");

router.post("/", async (req, res) => {
   try {
    //LOCAL TESTING
    console.log("IN RESEND");
    const orderid = req.body.orderid;
    const deliveryOrder = await models.DeliveryOrders.findOne(
        {
            where:
            {
                orderid:orderid
            }
        });


    let sendTo = `+1${req.body.to}`;


    var textResponse = await client.messages.create({
      body: req.body.message,
      from: process.env.TWILIO_NUMBER,
      to: sendTo,
    });
    
    const path = '/public';
    let mediaUrls = [];
    mediaUrls.push(`https://images.hiretheproz.com/${deliveryOrder.barcode}-0.jpeg`);
    mediaUrls.push(`https://images.hiretheproz.com/${deliveryOrder.barcode}-1.jpeg`);
    mediaUrls.push(`https://images.hiretheproz.com/${deliveryOrder.barcode}-2.jpeg`);
    mediaUrls.push(`https://images.hiretheproz.com/${deliveryOrder.barcode}-3.jpeg`);
    mediaUrls.push(`https://images.hiretheproz.com/${deliveryOrder.barcode}-4.jpeg`);


    try {
      let response = await client.messages
    .create({body: "Here are the photo(s) of the bike!", from: process.env.TWILIO_NUMBER, to: sendTo, mediaUrl: mediaUrls[0]})
    .then(message => console.log(message.sid));
    } catch (error) {
      
    }
    
    try {
      let response1 = await client.messages
    .create({body: "", from: process.env.TWILIO_NUMBER, to: sendTo, mediaUrl: mediaUrls[1]})
    .then(message => console.log(message.sid));
    } catch (error) {
      
    }

    try {
      let response2 = await client.messages
      .create({body: "", from: process.env.TWILIO_NUMBER, to: sendTo, mediaUrl: mediaUrls[2]})
      .then(message => console.log(message.sid));
    } catch (error) {
      
    }

    try {
      let response3 = await client.messages
      .create({body: "", from: process.env.TWILIO_NUMBER, to: sendTo, mediaUrl: mediaUrls[3]})
      .then(message => console.log(message.sid));
    } catch (error) {
      
    }

    try {
      let response4 = await client.messages
      .create({body: "", from: process.env.TWILIO_NUMBER, to: sendTo, mediaUrl: mediaUrls[4]})
      .then(message => console.log(message.sid));
      
    } catch (error) {
      
    }
    res.status(200).json({
      response: textResponse,
      message: `Message Sent To ${req.body.to}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      Error: err,
    });
  }
});



module.exports = router;

const express = require("express");
const router = express.Router();
const status = require("http-status");
const cryptoRandomString = require("crypto-random-string");

const models = require("../../../models");
const email = require("../../extensions/email");
const apiError = require("../../../libs/apiError");
const constVariables = require("../../../constants");
const apiMessage = require("../../../language/en.json");
const { Op } = require("sequelize");

function createEmailHtml(messageObj) {
  let html = [];
  html.push(`<p>${messageObj.message}</p>`);
  html.push("<br>")
  html.push("<br>")
  for (let image in messageObj.mediaUrl) {
    html.push(`<img src="${messageObj.mediaUrl[image]}"/>`)
  }

  return html.join("");
}

function sendEmailMain(args, messageObject) {
  const appName = process.env.APP_NAME ? process.env.APP_NAME : "BDA";
        const emailHTML = createEmailHtml(messageObject); 
        // <iframe width="100%" height="450" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?q=${messageObject.pos},-74.0059413&amp;key=YOUR_API_KEY"></iframe>
       args.email = 'cmiller@paradynamix.com';
        const emailText = messageObject.message;
        console.log(args, messageObject);
        try {
          email.sendEmail({
            to: args.email, // list of receivers
            subject: `Your bike is ready!`, // Subject line
            text: emailText, // plain text body
            html: emailHTML, // html body
          });
        } catch (error) {
          console.log("Email Error", error);
        }
        
  
}

// *************************
// Create Verify Token route
// *************************
router.post("/", async (req, res) => {
  const orderid = req.body.orderid;
  const deliveryOrder = await models.DeliveryOrders.findOne(
    {
        where:
        {
            orderid:orderid
        }
    });
  try {
    sendEmailMain(deliveryOrder, req.body);
  } catch (error) {
    
  }

  return res.send("success");
  
});

module.exports = router;

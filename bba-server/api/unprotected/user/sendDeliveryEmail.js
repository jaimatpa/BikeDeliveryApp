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

function createEmailHtml(messageObj, images) {
  let html = [];
  console.log(images);
  html.push(`<p>${messageObj}</p>`);
  html.push("<br>")
  html.push("<br>")
  images.forEach(image => {
    html.push(`<img style="border-bottom-color:black;border-bottom-style:solid;border-bottom-width:
    1px;border-left-color:black;border-left-style:solid;border-left-width:1px;
    border-right-color:black;border-right-style:solid;border-right-width:1px;
    border-top-color:black;border-top-style:solid;border-top-width:1px;" src="${image}" width="600" height="340"/>`)
  });

  return html.join("");
}

function sendEmailMain(args, message, images) {
  console.log("IN SEND EMAIL MAIN");
  const appName = process.env.APP_NAME ? process.env.APP_NAME : "BDA";
  const emailHTML = createEmailHtml(message, images);
  // <iframe width="100%" height="450" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?q=${messageObject.pos},-74.0059413&amp;key=YOUR_API_KEY"></iframe>
  // args.email = 'cmiller@paradynamix.com';
  if (args.email) {
    const emailText = message;
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
}

// *************************
// Create Verify Token route
// *************************
router.post("/", async (req, res) => {
  console.log("IN SEND DELIVER EMAIL POST");
  console.log(req.body);
  const orderid = req.body.orderid || req.body.params.orderid;
  const message = req.body.message || req.body.params.message;
  const images = req.body.images || req.body.params.images;
  const deliveryOrder = await models.DeliveryOrders.findOne(
    {
      where:
      {
        orderid: orderid
      }
    });
  try {
    sendEmailMain(deliveryOrder, message, images);
  } catch (error) {

  }
  return res.send("success");

});

module.exports = router;

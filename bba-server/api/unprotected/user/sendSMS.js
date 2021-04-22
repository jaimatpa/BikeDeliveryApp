const twilio = require("twilio");
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("Hello from SendSMS");
    console.log(req.body.mediaUrl[0]);

    var textResponse = await client.messages
      .create({body: req.body.message, from: process.env.TWILIO_NUMBER, to: `+13044839974`})
      .then(message => console.log(message.sid));

    var response = await client.messages
      .create({body: "Here are photo(s) of the bike!", from: process.env.TWILIO_NUMBER, to: `+13044839974`, mediaUrl: req.body.mediaUrl[0]})
      .then(message => console.log(message.sid));

    // client.messages
    //   .create({body: req.body.message, from: process.env.TWILIO_NUMBER, to: `+1${req.body.to}`, mediaUrl: req.body.mediaUrl})
    //   .then(message => console.log(message.sid));

    // client.messages.create({
    //   body: req.body.message,
    //   from: process.env.TWILIO_NUMBER,
    //   to: req.body.to,
    // });
    // res.status(200).json({
    //   response: response,
    //   message: `Message Sent To ${req.body.to}`,
    // });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      Error: err,
    });
  }
});

module.exports = router;

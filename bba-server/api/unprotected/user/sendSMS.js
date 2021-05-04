const twilio = require("twilio");
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const express = require("express");
const cors = require('cors');
const router = express.Router();
router.use(cors());

router.post("/", async (req, res) => {
  try {
    //LOCAL TESTING
    console.log("Hello from SendSMS");
    var textResponse = await client.messages.create({
      body: req.body.message,
      from: process.env.TWILIO_NUMBER,
      to: `+13044839974`,
    });
    if (req.body.mediaUrl === undefined || req.body.mediaUrl.length === 0) {
    } else {
      console.log("In IF Statement");
      var response = await client.messages
      .create({body: "Here are the photo(s) of the bike!", from: process.env.TWILIO_NUMBER, to: `+13044839974`, mediaUrl: req.body.mediaUrl})
      .then(message => console.log(message.sid));
    }

    // var textResponse = await client.messages.create({
    //   body: req.body.message,
    //   from: process.env.TWILIO_NUMBER,
    //   to: req.body.to,
    // });

    // if (req.body.mediaUrl === undefined || req.body.mediaUrl.length == 0) {
    // } else {
    //   var response = await client.messages
    //   .create({body: req.body.message, from: process.env.TWILIO_NUMBER, to: `+1${req.body.to}`, mediaUrl: req.body.mediaUrl})
    //   .then(message => console.log(message.sid));
    // }
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

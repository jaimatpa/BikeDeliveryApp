const twilio = require("twilio");
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const express = require("express");
const cors = require('cors');
const router = express.Router();
router.use(cors());

router.post("/", async (req, res) => {
  try 
  {
    //LOCAL TESTING
      console.log("Hello from SendSMS");

      let response = {};
      if (req.body.mediaUrl === undefined || req.body.mediaUrl.length == 0) 
      {
        response = await client.messages.create({
          body: req.body.message,
          from: process.env.TWILIO_NUMBER,
          to: req.body.to,
        });
      } 
      else 
      {
        let formattedNumber = req.body.to;
        if (formattedNumber.startsWith('+1')) {
            formattedNumber = formattedNumber.slice(2);
        }

        response = await client.messages.create({
            body: req.body.message,
            from: process.env.TWILIO_NUMBER,
            to: formattedNumber,
            mediaUrl: req.body.mediaUrl
        });
      }

      return res.status(200).json({
        response: response,
        message: `Message Sent To ${req.body.to}`,
      });
  } 
  catch (err) 
  {
      console.log(err);
      // res.status(500).json({
      //   Error: err,
      // });
  }

  res.status(200).json({
    Error: `Delivery has been completed, but the confirmation message was not sent.`,
  });
});



module.exports = router;

const twilio = require("twilio");
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const express = require("express");
const cors = require('cors');
const router = express.Router();
router.use(cors());

router.get("/", async (req, res) => {
    const search = req.query.search;
    const phoneNumber = req.query.phoneNumber
    let fromMessages = [];
    let toMessages = [];
    console.log(req.query);

    if (phoneNumber) {
        client.messages.list({ limit: 1000, from: phoneNumber }).then(messages => {
            messages.forEach(x => {
                x.dateSent = x.dateSent.toLocaleString('en-US');
                fromMessages = messages;
            });
        });
        client.messages.list({ limit: 1000, to: phoneNumber }).then(secondMessages => {
            secondMessages.forEach(x => {
                x.dateSent = x.dateSent.toLocaleString('en-US');
                toMessages = secondMessages;
            });
            return res.send(fromMessages.concat(toMessages));
        });
    } else {
        client.messages.list({ limit: 1000 }).then(messages => {
            messages.forEach(x => {
                x.dateSent = x.dateSent.toLocaleString('en-US')
            });
            return res.send(messages);
        });
    }
})

router.post("/sms", async (req, res) => {
    const twiml = new MessagingResponse();

    twiml.message('Any messages will not currently been seen by a support individual. If you are having an issue with your delivery, please contact that following number: 843-678-3720');

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});



module.exports = router;

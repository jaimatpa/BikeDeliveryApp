const express = require("express");
const router = express.Router();
const status = require("http-status");
const { Op } = require("sequelize");

const models = require("../../../models");
const apiError = require("../../../libs/apiError");
const constVariables = require("../../../constants");
const apiMessage = require("../../../language/en.json");

router.post("/", async (req, res) => {
  const data = await models.Templates.findOne();
  if (data) {
    data.body = req.body.template;
    await data.save();
  } else {
    await models.Templates.build({ body: req.body.template }).save();
  }
  //received the json here req.body
  // console.log(req.body)
  res.send(req.body);
});

router.get("/", async (req, res) => {
  const data = await models.Templates.findAll();
  return res.send(data[0]);
});

module.exports = router;

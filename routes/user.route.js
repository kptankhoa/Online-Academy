const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();

const UserController = require("../controllers/user.controller");
const Validator = require("../middlewares/validator.mdw");

router.get("/", (req, res, next) => {
  res.json({
    message: "tested",
  });
});

router.post("/", Validator.validateRequestBody("register_student"), UserController.createNewStudent);

module.exports = router;

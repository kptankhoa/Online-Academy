const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();

const Validator = require("../middlewares/validator.mdw");
const AuthController = require("../controllers/auth.controller");

router.post("/verify", Validator.validateRequestBody("validate_student"), AuthController.verifyUser);

module.exports = router;

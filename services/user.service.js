// const jwt = require("jsonwebtoken");
"use strict";
const bcrypt = require("bcryptjs");

const ajv = require("../configs/ajv.config");

const UserModel = require("../models/user.model");
const CONST = require("../models/constraint");
const VerifyService = require("./verify.service");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");


const salt = bcrypt.genSaltSync(10);


module.exports = {
  /**
   * 
   * @param {String} userId 
   * @return {Object} user
   */
  findUserById: async (userId) => {
    return await UserModel.findById(userId).exec();
  },

  /**
   * 
   * @param {String} userId 
   * @param {Object} newInfo include {fullName, phone, address}
   * @return {Object} new user info
   */
  updateUserInfo: async (userId, newInfo) => {
    try {
      return await UserModel.findOneAndUpdate(
        { _id: userId },
        { ...newInfo, updatedAt: Date.now() },
        { new: true }
      ).select([
        "fullName",
        "phone",
        "address",
        "updatedAt"
      ]);
    } catch (error) {
      throw Error(error);
    }
  },

  /**
   * Add an user to database
   * @param {object} user object user
   * @return {object} user
   */
  createUser: async (user) => {
    const newUser = createUserTemplate(user);
    if (newUser === null) {
      return null;
    }

    const validEmail = await checkValidEmail(user);
    if (!validEmail) {
      console.log("email is not valid");
      return null;
    }

    const result = await VerifyService.createNewValidateRequest(user.email);
    if (result === null) {
      return null;
    }

    newUser.password = bcrypt.hashSync(newUser.password, salt);
    // const securedUser = makeSecurityPassword(newUser);
    await UserModel.create(newUser);
    delete newUser.password;
    return newUser;
  },
  verifyUser: async (email, key) => {
    const valid = await VerifyService.validateUser(email, key);
    if (!valid) {
      return false;
    }

    const filter = {
      email: email
    };
    const updateInfo = {
      status: CONST.STATUS_ACTIVE
    };
    await UserModel.findOneAndUpdate(filter, updateInfo);
    return true;
  },

  logIn: async (loginInfo) => {
    const user = await UserModel.findOne({ username: loginInfo.username }).exec();
    if ((user === null) || !bcrypt.compareSync(loginInfo.password, user.password)) {
      return { authenticated: false };
    }
    const payload = {
      userId: user._id
    };
    const opts = {
      expiresIn: 10 * 60 // seconds
    };
    const accessToken = jwt.sign(payload, process.env.NOT_A_SECRET_KEY, opts);

    const refreshToken = randomstring.generate(80);
    await UserModel.findByIdAndUpdate(user._id, { rfToken: refreshToken });
    return {
      authenticated: true,
      accessToken,
      refreshToken
    };
  },

  refreshAccessToken: async (refreshInfo) => {
    const { accessToken, refreshToken } = refreshInfo;
    const { userId } = jwt.verify(accessToken, process.env.NOT_A_SECRET_KEY, {
      ignoreExpiration: true
    });
    const valid = await isValidRfToken(userId, refreshToken);
    if (valid === true) {
      const newAccessToken = jwt.sign({ userId }, process.env.NOT_A_SECRET_KEY, { expiresIn: 60 * 10 });
      return {
        accessToken: newAccessToken
      };
    }
    return null;
  }


};

/**
 * create user from raw infomation
 * @param {object} rawUser user information
 * @return {object} valid user
 */
function createUserTemplate(rawUser) {
  const user = rawUser;
  user.username = rawUser.username || "";
  user.password = rawUser.password || "";
  user.fullName = rawUser.fullName || "";
  user.address = rawUser.address || "";
  user.email = rawUser.email || "";
  user.createdAt = rawUser.createdAt || Date.now();
  user.updatedAt = Date.now();
  user.status = rawUser.status || CONST.STATUS_PENDING;
  user.avatar = rawUser.avatar || CONST.URL.DEFAULT_AVATAR;
  user.phone = rawUser.phone || "";
  user.wishList = rawUser.wishList || [];
  user.registeredList = rawUser.registeredList || [];

  const valid = validateUserObject(user);
  if (!valid) {
    return null;
  }
  return user;
}

/**
 * Validate user
 * @param {object} user user to validate
 * @return {bool} isvalid
 */
function validateUserObject(user) {
  const validate = ajv.getSchema("user");
  const valid = validate(user);
  if (!valid) {
    console.log(validate.errors);
    console.log({
      error: "input error",
      detail: validate.errors
    });
    return false;
  }
  return true;
}

/**
 * change string password to jwt
 * @param {object} user user object
 * @return {object} new user
 */
// function makeSecurityPassword(user) {
//   const newPassword = bcrypt.hashSync(user.password, 10);
//   const result = user;
//   result.password = newPassword;
//   return result;
// }

/**
 * Check email is valid or not
 * @param {object} user user object
 * @return {bool}
 */
async function checkValidEmail(user) {
  const filter = {
    email: user.email
  };
  const result = await UserModel.findOne(filter);
  if (result === null) {
    return true;
  }
  return false;
}
/**
 * Check valid rfToken by userId
 * @param {string} userId userId
 * @param {string} refreshToken refreshToken
 * @return {bool}
 */
async function isValidRfToken(userId, refreshToken) {
  const user = await UserModel.findById(userId).exec();
  if (user.rfToken === refreshToken) {
    return true;
  } else {
    return false;
  }
}

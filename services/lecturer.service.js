"use strict";
const bcrypt = require("bcryptjs");
const LecturerModel = require("../models/lecturer.model");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");

// const salt = bcrypt.genSaltSync(10);

module.exports = {
  logIn: async (loginInfo) => {
    const lecturer = await LecturerModel.findOne({
      username: loginInfo.username
    }).exec();
    if (
      lecturer === null ||
      !bcrypt.compareSync(loginInfo.password, lecturer.password)
    ) {
      return {authenticated: false};
    }
    const payload = {
      userId: lecturer._id
    };
    const opts = {
      expiresIn: 10 * 60 // seconds
    };
    const accessToken = jwt.sign(payload, process.env.NOT_A_SECRET_KEY, opts);

    const refreshToken = randomstring.generate(80);
    await LecturerModel.findByIdAndUpdate(lecturer._id, {
      rfToken: refreshToken
    });
    return {
      authenticated: true,
      accessToken,
      refreshToken
    };
  },

  refreshAccessToken: async (refreshInfo) => {
    const {accessToken, refreshToken} = refreshInfo;
    const {userId} = jwt.verify(accessToken, process.env.NOT_A_SECRET_KEY, {
      ignoreExpiration: true
    });
    const valid = await isValidRfToken(userId, refreshToken);
    if (valid === true) {
      const newAccessToken = jwt.sign(
        {userId},
        process.env.NOT_A_SECRET_KEY,
        {expiresIn: 60 * 10}
      );
      return {
        accessToken: newAccessToken
      };
    }
    return null;
  },

  getTeachingCourses: async (lecturerId) => {
    const lecturer = await LecturerModel.findById(lecturerId)
      .select("teachingCourses")
      .populate({
        path: "teachingCourses",
        populate:{path:"teachingCourses"}
      });
    return lecturer.teachingCourses;
  },

  removeCourseFromTeachingCoursesForAllLecturer: async (courseId) => {
    return await mRemoveCourseFromTeachingCoursesForAllLecturer(courseId);
  }
};

/**
 * Check valid rfToken by userId
 * @param {string} userId userId
 * @param {string} refreshToken refreshToken
 * @return {bool}
 */
async function isValidRfToken(userId, refreshToken) {
  const user = await LecturerModel.findById(userId).exec();
  if (user.rfToken === refreshToken) {
    return true;
  } else {
    return false;
  }
}

/**
 * Delete course
 * @param {string} courseId id of course
 * @return {Promise<number>} number course in lecturer is deleted
 */
async function mRemoveCourseFromTeachingCoursesForAllLecturer(courseId) {
  const lecturers = await LecturerModel.find({
    teachingCourses: {_id: courseId}
  });


  for (let index = 0; index < lecturers.length; index++) {
    await mDeleteCourseFromTeachingCourses(lecturers[index]._id, courseId);
  }

  return lecturers.length
}

/**
 *
 * @param {string} lecturerId lecturerID
 * @param {string} courseId courseId
 * @return {object}
 */
async function mDeleteCourseFromTeachingCourses(lecturerId, courseId) {
  const teachingCourses = await mGetListTechingCourses(lecturerId);
  const pos = teachingCourses.indexOf(courseId);
  if (pos > -1) {
    console.log("pos", pos);
    teachingCourses.splice(pos, 1);
    const res = await LecturerModel.findByIdAndUpdate(lecturerId, {
      teachingCourses: teachingCourses
    });
    return res;
  } else {
    return null;
  }
}

/**
 * Get list teaching course of lecturer
 * @param {string} lecturerId id
 * @return {Promise<Array<object>>}
 */
async function mGetListTechingCourses(lecturerId) {
  const res = await LecturerModel.findById(lecturerId);
  return res.teachingCourses;
}

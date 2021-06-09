"use strict";
const LecturerService = require("../services/lecturer.service");
const UserService = require("../services/user.service");
const CourseService = require("../services/course.service");

module.exports = {
  login: async (req, res, next) => {
    const loginInfo = req.body;
    const result = await LecturerService.logIn(loginInfo);
    if (!result) {
      return res.status(400).json({
        message: "Log in failed!"
      });
    } else {
      return res.json(result);
    }
  },

  refreshAcToken: async (req, res, next) => {
    const refreshInfo = req.body;
    const result = await LecturerService.refreshAccessToken(refreshInfo);
    if (!result) {
      return res.status(400).json({
        message: "Refresh token is revoked!"
      });
    } else {
      return res.json(result);
    }
  },

  getCourses: async (req, res, next) => {
    const lecturerId = req.params.lecturerId;
    try {
      const result = await LecturerService.getTeachingCourses(lecturerId);
      if (!result) {
        return res.status(400).json({
          message: "lecturerId not right!"
        });
      } else {
        return res.json(result);
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error });
    }
  },

  changeAvatar: async (req, res, next) => {
    try {
      const lecturerId = req.params.lecturerId;
      const imgFilePath = req.file.path;
      const lecturer = await LecturerService.changeLecturerAvatar(lecturerId, imgFilePath);
      return res.json(lecturer);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: "lecturer not found" });
    }
  },

  updateLecturerInfo: async (req, res, next) => {
    const lecturerId = req.params.lecturerId || 0;
    const newInfo = req.body;
    // console.log(newInfo);
    const updatedLecturer = await LecturerService.findAndUpdate(lecturerId, newInfo);

    if (updatedLecturer === null) {
      return res.status(400).json({
        error: "lecturer not found"
      });
    }
    res.json(updatedLecturer);
  },

  updateLecturerPassword: async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const lecturer = req.lecturer;

    const ret = await UserService.verifyPassword(currentPassword, lecturer.password);
    if (ret) {
      const updatedLecturer = await LecturerService.updatePassword(lecturer._id, newPassword);
      return res.json(updatedLecturer);
    } else {
      return res.status(400).json({
        error: "Incorrect password"
      });
    }
  },

  makeEmailVerification: async (req, res, next) => {
    const email = req.body.email;

    const verification = await LecturerService.makeChangeEmailVerification(email);
    if (verification) {
      return res.json({
        message: "verify your email"
      });
    } else {
      return res.status(400).json({
        error: "email is already taken"
      });
    }
  },

  verifyAndUpdateEmail: async (req, res, next) => {
    const lecturerId = req.params.lecturerId;
    const { email, key } = req.body;

    const updatedLecturer = await LecturerService.verifyEmail(lecturerId, email, key);
    if (updatedLecturer) {
      res.json(updatedLecturer);
    } else {
      res.status(400).json({
        error: "incorrect email or key"
      });
    }
  },

  uploadNewCourse: async (req, res, next) => {
    const lecturerId = req.params.lecturerId;
    const newCourseInfo = req.body;

    const course = await CourseService.getCourseByName(newCourseInfo.courseName);
    if (course) {
      return res.status(400).json({
        error: "course is already exists"
      });
    }

    const newCourse = await CourseService.createCourse(newCourseInfo, lecturerId);
    if (newCourse === null) {
      return res.status(400).json({
        error: "invalid course info"
      });
    }

    res.status(201).json(newCourse);
  }

};








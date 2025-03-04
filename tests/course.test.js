"use strict";

process.env.NODE_ENV = "test";

// const mongoose = require("mongoose");
// const Book = require("../app/models/book");
// const UserModel = require("../models/user.model");
const CoursesModel = require("../models/course.model");
const CategoryModel = require("../models/category.model");
const LecturerModel = require("../models/lecturer.model");

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const should = chai.should();

chai.use(chaiHttp);

describe("Courses", async () => {
  before(async () => {
    await require("../configs/db.config");
  });

  beforeEach(async () => {
    await CoursesModel.create({
      _id: "60b748b2a651451b6f25b377",
      courseName:
        "React - The Complete Guide (incl Hooks, React Router, Redux)",
      courseImage: "url(string)",
      courseLecturers: ["60b74346a651451b6f25b376"],
      category: "60b73923a651451b6f25b374",
      price: 100000,
      promotionalPrice: 10,
      briefDescription:
        "Dive in and learn React.js from scratch! Learn Reactjs,",
      detailDescription:
        "This course is the most up-to-date, comprehensive and bestselling",
      soldNumber: 0,
      ratedNumber: 0,
      lessionNumber: 5,
      totalHours: 0,
      ratingPoint: 0,
      status: "INCOMPLETE",
      createdAt: "2021-06-02T06:10:57.918Z",
      updatedAt: "2021-06-02T06:11:57.918Z",
      feedbacks: [],
      view: 5
    });
    await CoursesModel.create({
      _id: "60b74a89925c8e4710e90c6c",
      courseName: "The Complete Android N Developer Course",
      courseImage: "url(string)",
      courseLecturers: ["60b745c0925c8e4710e90c6a", "60b74681925c8e4710e90c6b"],
      category: "60b739cc925c8e4710e90c67",
      price: 2000000,
      promotionalPrice: 350000,
      briefDescription: "Learn Android App Development with Android 7",
      detailDescription: "Please note support for this course",
      soldNumber: 0,
      ratedNumber: 0,
      lessionNumber: 0,
      totalHours: 0,
      ratingPoint: 0,
      status: "INCOMPLETE",
      createdAt: "2021-06-01T06:21:55.000Z",
      updatedAt: "2021-06-01T06:21:55.000Z",
      feedbacks: [],
      view: 10
    });
    await CategoryModel.create({
      _id: "60b73923a651451b6f25b374",
      categoryName: "React",
      level: "WEB",
      isDeleted: false,
      createdAt: "2021-05-30T04:08:57.918Z",
      updatedAt: "2021-05-30T04:08:57.918Z"
    });

    await CategoryModel.create({
      _id: "60b739cc925c8e4710e90c67",
      categoryName: "Android Development",
      level: "MOBILE",
      isDeleted: false,
      createdAt: "2021-05-30T04:08:57.918Z",
      updatedAt: "2021-05-30T04:08:57.918Z"
    });
  });

  beforeEach(async () => {
    await LecturerModel.create({
      _id: "60b74346a651451b6f25b376",
      username: "lecturer1",
      password: "$2b$10$nmHFZwfDrHWZPbWVLJ.XIuxzPmLa.iN7eYKxuaip/RythHf2wWauq",
      fullName: "Maximilian Schwarzmüller",
      email: "1@gmail.com",
      avatar: "string (url)",
      address: "Viet Nam",
      createdAt: "2021-05-30T05:09:57.918Z",
      updatedAt: "2021-05-30T05:09:57.918Z",
      status: "ACTIVE",
      phone: "0123456789",
      description: "Starting out at the age of 13 I never stopped learning new",
      teachingCourses: ["60b748b2a651451b6f25b377"]
    });

    await LecturerModel.create({
      _id: "60b745c0925c8e4710e90c6a",
      username: "robpercival",
      password: "$2y$10$tweLVlBA1E4m7Kzl14HkJuDTCRJOTf311dthZ9IEtcVcC9fs8ttwq",
      fullName: "Rob Percival",
      email: "robpercival@mail.com",
      avatar:
        "https://img-c.udemycdn.com/user/75x75/4387876_78bc.jpg?Expires=1622703883&Signature=dvKY8Rv40q-qRoAoJX5-0Q~lXB7ZytOP4xzUc6doHO7XqD53-Klv2SGkWztyQE42dSKhrCuSz~kWNTE5UTRfbjKpqpKWWiVsLiwDuOCEiMAUau2vbEYmX7j8PrluRkUtw-3ZK~meDox1PNCDSM8Mtp23Xad-FygypYboVyDdPzKheFrHLkyWkOzvXOvIOC0zm~ANkHwVxgXpAYk-YT8EhuDP0GTTk9e7f4GtvWSAinTEkahhIgqvx9Dp2-SqDo7wSloN-KZAfN7EGr~CgQkn5ptnMU80ya4XoCEk2FBZdPoI~BuuHnXQtV1122qNWq9iJ~nXe-dXCvoE4lYSghcGLQ__&Key-Pair-Id=APKAITJV77WS5ZT7262A",
      address: "string",
      createdAt: "2021-05-30T05:08:57.918Z",
      updatedAt: "2021-05-30T05:08:57.918Z",
      status: "ACTIVE",
      phone: "string",
      description: "Hi! I'm Rob. I have a degree in Mathematics from",
      teachingCourses: ["60b74a89925c8e4710e90c6c"],
      rfToken:
        "NRxCUvG8NxRvjg43q5A1jdYY5rKFrI5k9MzeoQLcCTq4EClFntLzyeWertMAZ9GgeRMeEk0iEx3HVHvO"
    });

    await LecturerModel.create({
      _id: "60b74681925c8e4710e90c6b",
      username: "marcstock",
      password: "$2y$10$tweLVlBA1E4m7Kzl14HkJuDTCRJOTf311dthZ9IEtcVcC9fs8ttwq",
      fullName: "Marc Stock",
      email: "marcstock@mail.com",
      avatar:
        "https://img-c.udemycdn.com/user/200_H/9849986_e1a5_2.jpg?Expires=1622710094&Signature=gxadtXF3Cc5L9OGfph9ehCdruB52nljY16w~7mOXQuhiRC9FII0361KiNlrakoJWUID7nf3XlUUAo1pqrMYR3GaP~-YqwHjFy60ZEjpVI-uIvVffyNriZPSD8jpeV39JLJjMAEmOd0s9mcXufvhVFUrYNWyKM06oswwfX1omHoSCxBsic826Mtf3NfwFAWW9N-8bRF782Yr5Pm5uk9aSiFE2UpfBvXfiHx8DjEj5qgMrx~CRV47kTwS6rcuPqEutTm5KIayWFt8NiR1IcdRCoU8Rc7F9XeWZI1MV5cKvxideISJNK7gO73WJs7wc8Or6DyZmNMkdILsgdUffjr88Tw__&Key-Pair-Id=APKAITJV77WS5ZT7262A",
      address: "string",
      createdAt: "2021-05-30T05:08:57.918Z",
      updatedAt: "2021-05-30T05:08:57.918Z",
      status: "ACTIVE",
      phone: "string",
      description: "I have been a Mobile Game App Designer, Author",
      teachingCourses: ["60b74a89925c8e4710e90c6c"]
    });
  });

  afterEach(async () => {
    await CoursesModel.deleteMany({}, {});
    await CategoryModel.deleteMany({}, {});
    await LecturerModel.deleteMany({}, {});
  });

  // ------------------------------------------------------------------------------------------

  describe("#Get All Courses ", () => {
    it("it should GET all the courses", async () => {
      // console.log(process.env.TEST_MONGODB_URL);
      const res = await chai.request(app).get("/courses");

      should.exist(res);
      should.exist(res.body);
      res.should.have.status(200);
      res.body.should.be.a("object");
      res.body.docs.should.be.a("array");
      res.body.docs.length.should.be.eql(2);
      res.body.docs[0].should.have
        .property("courseName")
        .eql("React - The Complete Guide (incl Hooks, React Router, Redux)");
    });

    it("it should GET all the courses have query categoryId", async () => {
      // console.log(process.env.TEST_MONGODB_URL);
      const res = await chai.request(app)
      .get("/courses?categoryId=60b739cc925c8e4710e90c67");

      should.exist(res);
      should.exist(res.body);
      res.should.have.status(200);
      res.body.should.be.a("object");
      res.body.docs.should.be.a("array");
      res.body.docs.length.should.be.eql(1);
      res.body.docs[0].should.have
        .property("courseName")
        .eql("The Complete Android N Developer Course");
      res.body.should.have.property("page").eql(1);
    });
  });

  describe("#Get Course Information", async () => {
    it("it should GET the course information", async () => {
      const res = await chai
        .request(app)
        .get("/courses/60b748b2a651451b6f25b377");
      // should.not.exist(err);
      should.exist(res);
      should.exist(res.body);
      res.should.have.status(200);
      res.body.should.be.a("object");
      res.body.should.have.property("_id").eql("60b748b2a651451b6f25b377");
      res.body.should.have
        .property("courseName")
        .eql("React - The Complete Guide (incl Hooks, React Router, Redux)");
    });
  });

  describe("#Get lecturers of the course", async () => {
    it("it should list lecturer of the course", async () => {
      const res = await chai
        .request(app)
        .get("/courses/60b74a89925c8e4710e90c6c/lecturers");
      // should.not.exist(err);
      should.exist(res);
      should.exist(res.body);
      res.should.have.status(200);
      res.body.should.be.a("array");
      res.body.length.should.be.eql(2);
      res.body[0].should.have.property("_id").eql("60b745c0925c8e4710e90c6a");
      res.body[0].should.have.property("username").eql("robpercival");
    });
  });

  describe("#Get feedbacks of the course", async () => {
    it("it should list feedback of the course", async () => {
      const res = await chai
        .request(app)
        .get("/courses/60b74a89925c8e4710e90c6c/feedbacks");
      // should.not.exist(err);
      should.exist(res);
      should.exist(res.body);
      res.should.have.status(200);
      res.body.should.be.a("array");
      res.body.length.should.be.eql(0);
    });
  });

  describe("#Get same course", async () => {
    it("it should list feedback of the course", async () => {
      const res = await chai
        .request(app)
        .get("/statistics/same-course/60b74a89925c8e4710e90c6c");
      should.exist(res);
      should.exist(res.body);
      res.should.have.status(200);
      res.body.should.be.a("array");
      res.body.length.should.be.eql(1);
    });
  });
});

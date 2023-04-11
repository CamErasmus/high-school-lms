import express from "express";
import { teacher } from "../middleware/auth.js";

const router = express.Router();
import {
  table,
  view,
  classPerformance,
  viewStudentLessons,
  editTable,
  count,
  findStudentID,
  find,
  create,
  update,
  viewClass,
  deleteClass,
} from "../controllers/classController.js";

// Routes
router.get("/:teacherID", teacher, table);
router.post("/view/:teacherID", teacher, view);
router.post("/classperformance/:teacherID", teacher, classPerformance);
router.post("/viewstudententry", teacher, viewStudentLessons);
router.post("/edittable/:teacherID", teacher, editTable);
router.get("/count/:teacherID", teacher, count);
router.get("/addstudent/studentID", teacher, findStudentID);
router.post("/", teacher, find);
router.post("/create", teacher, create);
router.post("/updateclass/:classID", teacher, update);
router.get("/viewclass/:classID", teacher, viewClass);
router.post("/delete/:teacherID", teacher, deleteClass);

export { router as classList };

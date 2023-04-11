import express from "express";
import { teacher, parent, student } from "../middleware/auth.js";

const router = express.Router();
import {
  table,
  view,
  studentView,
  classSelect,
  clashList,
  create,
  studentClassList,
  studentCalendarList,
} from "../controllers/classScheduleController.js";

// Routes
router.get("/schedule/table/:teacherID", teacher, table);
router.get("/schedule/teacher/:teacherID", parent, view);
router.get("/schedule/student/:studentID", student, studentView);
router.get("/:teacherID", teacher, classSelect);
router.post("/clashlist/:teacherID", teacher, clashList);
router.post("/create/:teacherID", teacher, create);
router.post("/studentlist/:teacherID", teacher, studentClassList);
router.post("/studentlist", teacher, studentCalendarList);

export { router as timetable };

import express from "express";
import { teacher, student } from "../middleware/auth.js";

const router = express.Router();
import {
  table,
  create,
  view,
  editLesson,
  studentView,
  studentLoadLessons,
  loadClasses,
  studentData,
  studentEntry,
  deleteLessons,
} from "../controllers/lessonController.js";

// Routes
router.get("/:teacherID", teacher, table);
router.post("/create", student, create);
router.post("/view/:teacherID", teacher, view);
router.post("/edit/:teacherID", teacher, editLesson);
router.get("/studentview/:studentID", student, studentView);
router.post("/studentlessons/:studentID", student, studentLoadLessons);
router.get("/loadclasses/:studentID", student, loadClasses);
router.post("/loadentries/:studentID", student, studentData);
router.post("/addentry/:studentID", student, studentEntry);
router.post("/delete/:teacherID", teacher, deleteLessons);

export { router as lesson };

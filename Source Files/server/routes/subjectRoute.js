import express from "express";
import { superAdmin, admin, teacher } from "../middleware/auth.js";

const router = express.Router();
import {
  table,
  tableCount,
  subjectAdd,
  create,
  edit,
  update,
  viewSubject,
  deleteSubject,
} from "../controllers/subjectController.js";

// Routes
router.get("/table", teacher, table);
router.get("/tablecount", teacher, tableCount);
router.get("/subjectadd/:subjectID", teacher, subjectAdd);
router.post("/create", teacher, create);
router.get("/editsubject/:subjectID", teacher, edit);
router.post("/editsubject/:subjectID", teacher, update);
router.get("/viewsubject/:subjectID", teacher, viewSubject);
router.post("/delete/:subjectID", teacher, deleteSubject);
export { router as subjects };

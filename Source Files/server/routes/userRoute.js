import express from "express";
import { superAdmin, admin, parent } from "../middleware/auth.js";

const router = express.Router();
import {
  view,
  find,
  table,
  count,
  me,
  create,
  edit,
  update,
  viewUser,
  deleteUser,
  updateMe,
} from "../controllers/userController.js";

// Routes
router.get("/", admin, view);
router.post("/", admin, find);
router.get("/table", admin, table);
router.get("/tablecount", admin, count);
router.get("/me/:userID", admin, me);
router.post("/create", superAdmin, create);
router.get("/edituser/:userID", superAdmin, edit);
router.post("/edituser/:userID", superAdmin, update);
router.get("/viewuser/:userID", admin, viewUser);
router.post("/delete/:userID", superAdmin, deleteUser);
router.post("/me/editpassword/:userID", parent, updateMe);

export { router as user };

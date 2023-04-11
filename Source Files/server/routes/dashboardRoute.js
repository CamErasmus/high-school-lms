import express from "express";
import {
  superAdmin,
  admin,
  teacher,
  student,
  parent,
} from "../middleware/auth.js";

const router = express.Router();
import {
  countEnrolled,
  //   find,
  //   create,
  //   edit,
  //   update,
  //   viewWaitingList,
  //   deleteWaitingList,
} from "../controllers/dashboardController.js";

// Routes
router.get("/countenrolled", admin, countEnrolled);
// router.post("/", admin, find);
// router.post("/create", admin, create);
// router.get("/editwaitinglist/:waitingID", admin, edit);
// router.post("/editwaitinglist/:waitingID", admin, update);
// router.get("/viewwaitinglist/:waitingID", admin, viewWaitingList);
// router.get("/:userID", superAdmin, deleteWaitingList);

export { router as dahsboard };

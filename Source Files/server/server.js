import express from "express";
const app = express();
import cors from "cors";
import { auth } from "./routes/authRoute.js";
import { attendance } from "./routes/attendanceRoute.js";
import { stress } from "./routes/stressRoute.js";
import { user } from "./routes/userRoute.js";
import { student } from "./routes/studentRoute.js";
import { teacher } from "./routes/teacherRoute.js";
import { parent } from "./routes/parentRoute.js";
import { waitingList } from "./routes/waitingListRoute.js";
import { subjects } from "./routes/subjectRoute.js";
import { lesson } from "./routes/lessonRoute.js";
import { classList } from "./routes/classRoutes.js";
import { dahsboard } from "./routes/dashboardRoute.js";
import { intervention } from "./routes/interventionRoute.js";
import { calendar } from "./routes/calendarRoute.js";
import { timetable } from "./routes/classScheduleRoute.js";

// App.use
app.use(express.json({ limit: 100000000000 }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://demo.synaptic.icu",
      "http://www.demo.synaptic.icu/",
      "https://demo.synaptic.icu",
      "https://www.demo.synaptic.icu",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth/", auth);
app.use("/api/stress/", stress);
app.use("/api/calendar/", calendar);
app.use("/api/attendance/", attendance);
app.use("/api/users/", user);
app.use("/api/students/", student);
app.use("/api/parents/", parent);
app.use("/api/teachers/", teacher);
app.use("/api/waiting/", waitingList);
app.use("/api/subjects/", subjects);
app.use("/api/lessons/", lesson);
app.use("/api/classes/", classList);
app.use("/api/dashboards/", dahsboard);
app.use("/api/interventions/", intervention);
app.use("/api/timetable/", timetable);

// App listen
const port = 3001;
app.listen(port, () => console.log(`Listening on port ${port}`));

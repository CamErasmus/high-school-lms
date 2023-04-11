import { db } from "../startup/db.js";

export const table = async (req, res) => {
  const { teacherID } = req.params;

  db.query(
    `SELECT si.classID, SUBSTRING_INDEX(si.title, ' (', 1) AS title, ci.classIdentifier, COUNT(DISTINCT si.startTime, si.endTime) AS classesPerWeek, SUM(ROUND(TIME_TO_SEC(TIMEDIFF(si.endTime, si.startTime)) / 60)) AS totalMinutes
    FROM schedule_index si
    JOIN schedule_info sii ON si.id = sii.scheduleID
    JOIN class_index ci ON si.classID = ci.classID
    WHERE sii.teacherID = ?
    GROUP BY si.classID, si.title, ci.classIdentifier;`,
    [teacherID],
    (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
      } else {
        res.status(200).send(rows);
      }
    }
  );
};

export const classSelect = async (req, res) => {
  const { teacherID } = req.params;

  db.query(
    `SELECT 
    cs.classID, 
    ci.subjectTitle, 
    ci.subjectLevel, 
    ci.syllabusCode, 
    ci.classIdentifier 
  FROM 
    class_index ci 
    JOIN class_student cs ON ci.classID = cs.classID AND ci.subjectID = cs.subjectID 
  WHERE 
    ci.teacherID = ?
  GROUP BY 
    cs.classID 
  ORDER BY 
    ci.subjectTitle ASC`,
    [teacherID],
    (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
      } else {
        res.status(200).send(rows);
      }
    }
  );
};

export const studentClassList = async (req, res) => {
  const { teacherID } = req.params;
  const { classID } = req.body;

  db.query(
    `SELECT
    cs.studentID,
  ui.firstName, 
  ui.lastName 
FROM 
  class_index ci 
  JOIN class_student cs ON ci.classID = cs.classID
  JOIN user_index ui ON cs.studentID = ui.userID 
WHERE 
  ci.teacherID = ? AND ci.classID = ?
ORDER BY 
 ui.firstName ASC;`,
    [teacherID, classID],
    (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
      } else {
        res.status(200).send(rows);
      }
    }
  );
};

export const clashList = (req, res) => {
  const { classID, startTime, endTime, day } = req.body;

  db.query(
    `SELECT DISTINCT c.studentID, c.classID, u.firstName, u.lastName, s.startTime, s.endTime, u2.firstName AS teacherFirstName, u2.lastName AS teacherLastName, si.subjectTitle, si.subjectLevel
    FROM class_student c
    JOIN user_index u ON c.studentID = u.userID
    JOIN schedule_index s ON c.classID = s.classID
    JOIN class_student c2 ON s.classID = c2.classID
    JOIN user_index u2 ON c2.teacherID = u2.userID
    JOIN subject_index si ON c2.subjectID = si.subjectID
    JOIN schedule_info sii ON sii.classID = c2.classID
    WHERE c.studentID IN (
      SELECT studentID
      FROM class_student
      WHERE classID != ? OR classID = ?
    ) AND sii.daysOfWeek = ? AND (
      (s.startTime <= ? AND s.endTime > ?) OR
      (s.startTime >= ? AND s.startTime < ?) OR
      (s.endTime > ? AND s.endTime <= ?)
    );`,
    [
      classID,
      classID,
      day,
      startTime,
      endTime,
      startTime,
      endTime,
      startTime,
      endTime,
    ],
    (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
      } else {
        res.status(200).send(rows);
      }
    }
  );
};

export const create = (req, res) => {
  const {
    color,
    day,
    startTime,
    endTime,
    classID,
    teacherName,
    subject,
    level,
  } = req.body;
  const { teacherID } = req.params;

  const title = `${subject} ${level} (${teacherName})`;
  const now = new Date();
  const formattedNow = now.toISOString().slice(0, 10);
  const lastDay = new Date(now.getFullYear(), 11, 31);
  const formattedLastDay = lastDay.toISOString().slice(0, 10);

  db.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
    } else {
      connection.query(
        "SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE",
        function (err) {
          if (err) {
            console.log(err);
          } else {
            connection.beginTransaction(function (err) {
              if (err) {
                connection.rollback(function () {
                  connection.release();
                  console.log(err);
                });
              } else {
                connection.query(
                  "INSERT INTO schedule_index SET title = ?, startTime = ?, endTime = ?, color = ?, classID = ?",
                  [title, startTime, endTime, color, classID],
                  (err, results) => {
                    if (err) {
                      connection.rollback(function () {
                        connection.release();
                        console.log(err);
                        res.status(500).send("Something went wrong");
                      });
                    } else {
                      const scheduleID = results.insertId;
                      connection.query(
                        "INSERT INTO schedule_info SET classID = ?, teacherID = ?, daysOfWeek = ?, startRecur = ?, endRecur = ?, scheduleID = ?",
                        [
                          classID,
                          teacherID,
                          day,
                          formattedNow,
                          formattedLastDay,
                          scheduleID,
                        ],
                        (err) => {
                          if (err) {
                            connection.rollback(function () {
                              connection.release();
                              console.log(err);
                              res.status(500).send("Something went wrong");
                            });
                          } else {
                            connection.commit(function (err) {
                              if (err) {
                                connection.rollback(function () {
                                  connection.release();
                                  console.log(err);
                                  res.status(500).send("Something went wrong");
                                });
                              } else {
                                connection.release();
                                res
                                  .status(200)
                                  .send("Class successfully scheduled.");
                              }
                            });
                          }
                        }
                      );
                    }
                  }
                );
              }
            });
          }
        }
      );
    }
  });
};

// STUDENT TIMETABLE VIEW
export const studentView = (req, res) => {
  const { studentID } = req.params;

  db.query(
    `SELECT DISTINCT si.title, si.classID, si.startTime, si.endTime, si.color, sii.daysOfWeek, sii.startRecur, sii.endRecur
    FROM class_student cs
    JOIN schedule_index si ON cs.classID = si.classID 
    JOIN schedule_info sii ON cs.classID = sii.classID AND si.id = sii.scheduleID
    WHERE cs.studentID = ?;`,
    [studentID],
    (err, rows) => {
      if ((!err, rows)) {
        const events = rows.map((result) => ({
          id: result.id,
          title: result.title,
          startTime: result.startTime,
          endTime: result.endTime,
          color: result.color,
          daysOfWeek: result.daysOfWeek
            .split(",")
            .map((day) => `${day.trim()}`),
          startRecur: result.startRecur,
          endRecur: result.endRecur,
          classID: result.classID,
        }));
        res.status(200).send(events);
      } else {
        res.status(500).send("Something went wrong.");
      }
    }
  );
};

// TEACHER TIMETABLE VIEW
export const view = (req, res) => {
  const { teacherID } = req.params;

  if (teacherID.length) {
    db.query(
      `SELECT DISTINCT si.title, si.classID, si.startTime, si.endTime, si.color, sii.daysOfWeek, sii.startRecur, sii.endRecur 
      FROM schedule_index si 
      RIGHT JOIN schedule_info sii 
      ON si.classID = sii.classID AND si.id = sii.scheduleID
      WHERE sii.teacherID = ?;`,
      [teacherID],
      (err, rows) => {
        if ((!err, rows)) {
          const events = rows.map((result) => ({
            id: result.id,
            title: result.title,
            startTime: result.startTime,
            endTime: result.endTime,
            color: result.color,
            daysOfWeek: result.daysOfWeek
              .split(",")
              .map((day) => `${day.trim()}`),
            startRecur: result.startRecur,
            endRecur: result.endRecur,
            classID: result.classID,
          }));
          res.status(200).send(events);
        } else {
          res.status(500).send("Something went wrong.");
        }
      }
    );
  } else {
    db.query(
      `SELECT DISTINCT si.title, si.classID, si.startTime, si.endTime, si.color, sii.daysOfWeek, sii.startRecur, sii.endRecur 
      FROM schedule_index si 
      RIGHT JOIN schedule_info sii 
      ON si.classID = sii.classID AND si.id = sii.scheduleID;`,
      [teacherID],
      (err, rows) => {
        if ((!err, rows)) {
          const events = rows.map((result) => ({
            id: result.id,
            title: result.title,
            startTime: result.startTime,
            endTime: result.endTime,
            color: result.color,
            daysOfWeek: result.daysOfWeek
              .split(",")
              .map((day) => `${day.trim()}`),
            startRecur: result.startRecur,
            endRecur: result.endRecur,
            classID: result.classID,
          }));
          res.status(200).send(events);
        } else {
          res.status(500).send("Something went wrong.");
        }
      }
    );
  }
};

//Student List Offcanvas
export const studentCalendarList = (req, res) => {
  const { classID } = req.body;

  db.query(
    `SELECT cs.studentID, ui.firstName, ui.lastName
    FROM class_student cs
    INNER JOIN schedule_index si ON cs.classID = si.classID
    INNER JOIN user_index ui ON cs.studentID = ui.userID
    WHERE cs.classID = ?;`,
    [classID],
    (err, rows) => {
      if (!err) {
        res.status(200).send(rows);
      } else {
        res.status(500).send("Something went wrong.");
      }
    }
  );
};

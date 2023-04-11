import { db } from "../startup/db.js";

export const table = async (req, res) => {
  db.query(
    `SELECT li.teacherID, li.subjectID, si.subjectTitle, si.subjectLevel, si.syllabusCode, si.subjectGroup, COUNT(*) AS lessonCount
    FROM lesson_index li
    JOIN subject_index si ON li.subjectID = si.subjectID
    WHERE li.teacherID = ?
    GROUP BY li.teacherID, li.subjectID, si.subjectTitle, si.subjectLevel, si.syllabusCode, si.subjectGroup;`,
    [req.params.teacherID],
    (err, rows) => {
      if (err) {
        res.status(500).send("Server failed");
      } else {
        res.status(200).send(rows);
      }
    }
  );
};

// Add new lesson
export const create = async (req, res) => {
  const createdAt = new Date().toLocaleString("en-GB", {
    timeZone: "Africa/Johannesburg",
  });

  const { teacherID, subjectID, lessonData, classID } = req.body;

  db.query(
    "SELECT MAX(lessonNumber) FROM lesson_index WHERE subjectID = ? AND teacherID = ?",
    [subjectID, teacherID],
    (error, results) => {
      if (error) throw error;
      if (results[0]["MAX(lessonNumber)"] === null) {
        let lessonNumber = 1;

        db.query(
          "INSERT INTO lesson_index SET classID = ?, teacherID = ?, subjectID = ?, lessonNumber = ?, topicNumber = ?, lessonTitle = ?, syllabusOutline = ?, textbookPages = ?, teacherNotes = ?, links = ?, createdAt = ?",
          [
            classID,
            teacherID,
            subjectID,
            lessonNumber,
            lessonData.topicNumber,
            lessonData.lessonTitle,
            lessonData.syllabusOutline,
            lessonData.textbookPages,
            lessonData.teacherNotes,
            lessonData.links,
            createdAt,
          ],
          (err) => {
            if (err) {
              console.log(err);
              res.status(401).send("Something went wrong...");
            } else {
              res.status(200).send("Lesson created successfully.");
            }
          }
        );
      } else {
        let lessonNumber = (results[0]["MAX(lessonNumber)"] += 1);

        db.query(
          "INSERT INTO lesson_index SET classID = ?, teacherID = ?, subjectID = ?, lessonNumber = ?, topicNumber = ?, lessonTitle = ?, syllabusOutline = ?, textbookPages = ?, teacherNotes = ?, links = ?, createdAt = ?",
          [
            classID,
            teacherID,
            subjectID,
            lessonNumber,
            lessonData.topicNumber,
            lessonData.lessonTitle,
            lessonData.syllabusOutline,
            lessonData.textbookPages,
            lessonData.teacherNotes,
            lessonData.links,
            createdAt,
          ],
          (err) => {
            if (err) {
              console.log(err);
              res.status(401).send("Something went wrong...");
            } else {
              res.status(200).send("Lesson created successfully.");
            }
          }
        );
      }
    }
  );
};

export const view = async (req, res) => {
  const { teacherID } = req.params;
  const { subjectID } = req.body;

  db.query(
    "SELECT lessonID, lessonNumber, topicNumber, lessonTitle, syllabusOutline, textbookPages, teacherNotes, links, createdAt, updatedAt FROM lesson_index WHERE teacherID = ? AND subjectID = ?;",
    [teacherID, subjectID],
    (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong...");
      } else {
        res.status(200).send(rows);
      }
    }
  );
};

export const editLesson = async (req, res) => {
  const { teacherID } = req.params;
  const { lessonData } = req.body;

  const updatedAt = new Date().toLocaleString("en-GB", {
    timeZone: "Africa/Johannesburg",
  });

  db.query(
    "UPDATE lesson_index SET topicNumber = ?, lessonTitle = ?, syllabusOutline = ?, textbookPages = ?, teacherNotes = ?, links = ?, updatedAt = ? WHERE lessonID = ? AND teacherID = ?",
    [
      lessonData.topicNumber,
      lessonData.lessonTitle,
      lessonData.syllabusOutline,
      lessonData.textbookPages,
      lessonData.teacherNotes,
      lessonData.links,
      updatedAt,
      lessonData.lessonID,
      teacherID,
    ],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong...");
      } else {
        res.status(200).send("Lesson successfully updated.");
      }
    }
  );
};

export const studentView = async (req, res) => {
  const { studentID } = req.params;

  db.query(
    "SELECT cs.studentID, cs.subjectID,  si.subjectTitle, si.subjectLevel, si.syllabusCode FROM class_student cs JOIN subject_index si ON cs.subjectID = si.subjectID WHERE cs.studentID = ?;",
    [studentID],
    (err, rows) => {
      if (err) {
        res.status(500).send("Something went wrong");
      } else {
        res.status(200).send(rows);
      }
    }
  );
};

export const studentLoadLessons = async (req, res) => {
  const { teacherID, subjectID } = req.body;

  db.query(
    "SELECT lessonID, lessonNumber, topicNumber, lessonTitle, syllabusOutline, textbookPages, teacherNotes, links FROM lesson_index WHERE teacherID = ? AND subjectID = ?;",
    [teacherID, subjectID],
    (err, rows) => {
      if (err) {
        res.status(401).send("Something went wrong");
      } else {
        res.status(200).send(rows);
      }
    }
  );
};

export const loadClasses = async (req, res) => {
  const { studentID } = req.params;

  db.query(
    "SELECT ci.classID, ci.teacherID, ci.subjectTitle, ci.subjectLevel, ci.syllabusCode, ci.subjectID, ci.classIdentifier FROM class_index ci LEFT JOIN class_student cs ON cs.classID = ci.classID WHERE cs.studentID = ?;",
    [studentID],
    (err, rows) => {
      if (err) {
        res.status(401).send("Something went wrong");
      } else {
        res.status(200).send(rows);
      }
    }
  );
};

export const studentData = async (req, res) => {
  const { studentID } = req.params;
  const { subjectID } = req.body;

  db.query(
    "SELECT li.lessonID, li.lessonNumber, li.teacherID, li.subjectID, li.topicNumber, li.lessonTitle, li.syllabusOutline, li.textbookPages, li.teacherNotes, li.links, le.studentID, le.lessonStatus, le.studyTime, le.studentNotes FROM lesson_index li LEFT JOIN lesson_entries le ON li.lessonID = le.lessonID AND le.studentID = ? WHERE li.subjectID = ?;",
    [studentID, subjectID],
    (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong.");
      } else {
        res.send(rows);
      }
    }
  );
};

export const studentEntry = async (req, res) => {
  const { studentID } = req.params;
  const { classID, subjectID, lessonData } = req.body;
  const updatedAt = new Date().toLocaleString("en-GB", {
    timeZone: "Africa/Johannesburg",
  });

  let success = true;
  let sanitizedArray = [];
  for (const obj of lessonData) {
    if (
      obj.lessonStatus !== null &&
      obj.studyTime !== null &&
      obj.studentNotes !== null
    ) {
      sanitizedArray.push(obj);
    }
  }

  for (let i = 0; i < sanitizedArray.length; i++) {
    let sql = `SELECT * FROM lesson_entries WHERE lessonID = ? AND classID = ? AND subjectID = ? AND studentID = ?`;
    let values = [sanitizedArray[i].lessonID, classID, subjectID, studentID];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        success = false;
        res
          .status(500)
          .send("Error occurred while checking for existing record");
        return;
      }
      if (result.length) {
        let sql = `UPDATE lesson_entries SET lessonStatus = ?, studyTime = ?, studentNotes = ?, updatedAt = ? WHERE lessonID = ? AND classID = ? AND subjectID = ? AND studentID = ?`;
        let values = [
          sanitizedArray[i].lessonStatus || null,
          sanitizedArray[i].studyTime || null,
          sanitizedArray[i].studentNotes || null,
          updatedAt,
          sanitizedArray[i].lessonID,
          classID,
          subjectID,
          studentID,
        ];
        db.query(sql, values, (err, result) => {
          if (err) {
            console.log(err);
            success = false;
            res.status(500).send("Something went wrong...");
            return;
          }
        });
      } else {
        let sql = `INSERT INTO lesson_entries (lessonID, classID, subjectID, studentID, lessonStatus, studyTime, studentNotes, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        let values = [
          sanitizedArray[i].lessonID,
          classID,
          subjectID,
          studentID,
          sanitizedArray[i].lessonStatus || null,
          sanitizedArray[i].studyTime || null,
          sanitizedArray[i].studentNotes || null,
          updatedAt,
        ];
        db.query(sql, values, (err, result) => {
          if (err) {
            console.log(err);
            success = false;
            res.status(500).send("Something went wrong...");
          } else {
          }
        });
      }
    });
  }
  if (success) {
    res.status(200).send("Lesson Entries Successfully Updated!");
  }
};

export const deleteLessons = async (req, res) => {
  const { teacherID } = req.params;
  const { selectedID } = req.body;

  db.query(
    "DELETE FROM lesson_index WHERE teacherID = ? AND subjectID = ?;",
    [teacherID, selectedID],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong.");
      } else {
        res.status(200).send("Lessons successfully deleted.");
      }
    }
  );
};

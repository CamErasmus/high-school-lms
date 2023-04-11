import { db } from "../startup/db.js";

// View Classes
export const table = (req, res) => {
  const { teacherID } = req.params;
  // User the connection
  db.query(
    `SELECT ci.classID, ci.teacherID, ci.subjectID, ci.subjectTitle, ci.subjectLevel, ci.syllabusCode, ci.classIdentifier, ci.subjectGroup, ci.createdAt, ci.updatedAt, COUNT(DISTINCT cs.studentID) AS 'classSize', (CASE WHEN s.classID IS NOT NULL THEN 'Yes' ELSE 'No' END) AS 'status'
    FROM class_index ci
    LEFT JOIN class_student cs ON cs.classID = ci.classID AND cs.teacherID = ci.teacherID
    LEFT JOIN schedule_index s ON s.classID = ci.classID
    WHERE ci.teacherID = ?
    GROUP BY ci.classID, ci.teacherID, ci.subjectID, ci.subjectTitle, ci.subjectLevel, ci.syllabusCode, ci.classIdentifier, ci.subjectGroup, ci.createdAt, ci.updatedAt, s.classID
    ORDER BY ci.subjectTitle ASC;`,
    [teacherID],
    (err, rows) => {
      // When done with the connection, release it
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
};

// View Classes
export const view = async (req, res) => {
  const { classID } = req.body;
  // User the connection

  db.query(
    "SELECT u.userID AS 'studentID', u.firstName, u.lastName FROM user_index u LEFT JOIN class_student cs ON cs.studentID = u.userID WHERE cs.classID = ?;",
    [classID],
    (err, rows) => {
      if (!err) {
        res.status(200).send(rows);
      } else {
        res.status(400).send("This class does not exist");
      }
    }
  );
};

export const viewStudentLessons = async (req, res) => {
  const { classID, studentID } = req.body;

  db.query(
    "SELECT li.lessonID, li.lessonNumber, li.teacherID, li.subjectID, li.topicNumber, li.lessonTitle, li.syllabusOutline, li.textbookPages, li.teacherNotes, li.links, le.studentID, le.lessonStatus, le.studyTime, le.studentNotes FROM lesson_index li LEFT JOIN lesson_entries le ON li.lessonID = le.lessonID AND le.studentID = ? WHERE li.classID = ?;",
    [studentID, classID],
    (err, rows) => {
      if (err) {
        res.status(500).send("Something went wrong");
      } else {
        res.status(200).send(rows);
      }
    }
  );
};

export const editTable = async (req, res) => {
  const { classIdentifierTable, syllabusCodeTable } = req.body;
  const { teacherID } = req.params;
  // User the connection

  db.query(
    `SELECT userID, firstName, lastName FROM userIndex WHERE userID IN (SELECT studentID AS 'userID' FROM class_index WHERE teacherID = '${teacherID}' AND syllabusCode = '${syllabusCodeTable}' AND classIdentifier = '${classIdentifierTable}');`,
    (err, rows) => {
      if (!err) {
        res.status(200).send(rows);
      } else {
        res.status(400).send("This class does not exist");
      }
    }
  );
};

// Count Classes
export const count = (req, res) => {
  db.query(
    "SELECT COUNT(count) AS 'count' FROM (SELECT subjectTitle, classIdentifier, COUNT(DISTINCT classIdentifier) AS 'count' FROM class_index WHERE teacherID = ? GROUP BY subjectTitle, classIdentifier) AS total;",
    [req.params.teacherID],
    (err, response) => {
      if (!err) {
        res.send(response);
      } else {
        console.log(err);
      }
    }
  );
};

// View Classes
export const me = async (req, res) => {
  db.query(
    "SELECT * FROM class_index WHERE teacherID = ?",
    [req.user.teacherID],
    (err, result) => {
      res.send(result);
    }
  );
};

export const teacherID = (req, res) => {
  // User the connection
  db.query(
    "SELECT userID, firstName, lastName FROM user_index WHERE role = 'superAdmin' OR role = 'admin' OR role = 'teacher';",
    (err, rows) => {
      // When done with the connection, release it
      if (!err) {
        res.send(rows);
      } else {
        console.log(err).res.send({ alert: err });
      }
    }
  );
};

export const findSubjectID = (req, res) => {
  // User the connection
  db.query(
    "SELECT subjectID, subjectTitle, subjectLevel, syllabusCode FROM subject_index;",
    (err, rows) => {
      // When done with the connection, release it
      if (!err) {
        res.send(rows);
      } else {
        console.log(err).res.send({ alert: err });
      }
    }
  );
};

export const findStudentID = (req, res) => {
  // User the connection
  db.query(
    "SELECT userID, firstName, lastName FROM user_index WHERE role = 'student';",
    (err, rows) => {
      // When done with the connection, release it
      if (!err) {
        res.send(rows);
      } else {
        console.log(err).res.send({ alert: err });
      }
    }
  );
};

export const classPerformance = async (req, res) => {
  const { classID } = req.body;

  db.query(
    `SELECT 
    ui.firstName,
    ui.lastName,
    ROUND(IFNULL(COUNT(CASE WHEN le.lessonStatus = 'Completed' THEN 1 END) / (
        SELECT COUNT(classID) 
        FROM lesson_index 
        WHERE classID = ?
    ) * 100,0),0) AS percentage,
    cs.classID,
    cs.studentID
FROM 
    class_student cs
    LEFT JOIN user_index ui ON cs.studentID = ui.userID
    LEFT JOIN lesson_entries le ON cs.studentID = le.studentID 
    LEFT JOIN lesson_index li ON le.lessonID = li.lessonID
    AND li.classID = cs.classID
WHERE 
    cs.classID = ?
GROUP BY 
    cs.studentID,
    cs.classID
ORDER BY
	ui.firstName;`,
    [classID, classID],
    (err, result) => {
      if (err) {
        res.status(500).send("Something went wrong");
      } else {
        res.send(result);
      }
    }
  );
};

// Add new class
export const create = (req, res) => {
  const createdAt = new Date().toLocaleString("en-GB", {
    timeZone: "Africa/Johannesburg",
  });

  const {
    teacherID,
    subjectID,
    classIdentifier,
    studentList,
    subjectTitle,
    subjectLevel,
    syllabusCode,
    subjectGroup,
  } = req.body;

  db.getConnection((err, connection) => {
    if (err) {
      res.status(500).send("Something went wrong...");
      return;
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        res.status(500).send("Something went wrong...");
        return;
      }

      connection.query(
        "INSERT INTO class_index (teacherID, subjectID, subjectTitle, subjectLevel, syllabusCode, subjectGroup, classIdentifier, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
        [
          teacherID,
          subjectID,
          subjectTitle,
          subjectLevel,
          syllabusCode,
          subjectGroup,
          classIdentifier,
          createdAt,
        ],
        (err) => {
          if (err) {
            connection.rollback(() => {
              connection.release();
              res.status(500).send("Something went wrong...");
            });
            return;
          }

          connection.query("SELECT LAST_INSERT_ID();", (err, results) => {
            if (err) {
              connection.rollback(() => {
                connection.release();
                res.status(500).send("Something went wrong...");
              });
              return;
            }

            const classID = results[0]["LAST_INSERT_ID()"];
            const studentData = [];

            studentList.forEach((student) => {
              studentData.push([
                classID,
                teacherID,
                student.studentID,
                subjectID,
              ]);
            });

            connection.query(
              "INSERT INTO class_student (classID, teacherID, studentID, subjectID) VALUES ?",
              [studentData],
              (err) => {
                if (err) {
                  connection.rollback(() => {
                    connection.release();
                    res.status(500).send("Something went wrong...");
                  });
                  return;
                }

                connection.commit((err) => {
                  if (err) {
                    connection.rollback(() => {
                      connection.release();
                      res.status(500).send("Something went wrong...");
                    });
                  } else {
                    connection.release();
                    res.status(200).send("Class successfully created.");
                  }
                });
              }
            );
          });
        }
      );
    });
  });
};

// Find Subject by Search
export const find = (req, res) => {
  let searchTerm = req.body.search;
  // Use the connection
  db.query(
    "SELECT * FROM subject_index WHERE subjectTitle LIKE ? OR subjectLevel LIKE ? OR syllabusCode LIKE ? OR subjectGroup LIKE ?",
    [
      "%" + searchTerm + "%",
      "%" + searchTerm + "%",
      "%" + searchTerm + "%",
      "%" + searchTerm + "%",
    ],
    (err, rows) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
};

// Update Class
export const update = async (req, res) => {
  const updatedAt = new Date().toLocaleString("en-GB", {
    timeZone: "Africa/Johannesburg",
  });
  const { teacherID, subjectIdTable, studentList } = req.body;

  db.query(
    "DELETE FROM class_student WHERE classID = ? AND subjectID = ?",
    [req.params.classID, subjectIdTable],
    function (err) {
      if (err) {
        res.status(500).send("Something went wrong...");
      } else {
        db.getConnection(function (err, connection) {
          if (err) {
            console.log(err);
          } else {
            connection.query(
              "SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;",
              function (err) {
                if (err) {
                  console.log(err);
                } else {
                  connection.beginTransaction(function (err) {
                    if (err) {
                      connection.rollback(function (err) {
                        connection.release();
                        console.log(err);
                      });
                    } else {
                      let parentArr = [
                        {
                          classID: req.params.classID,
                          teacherID: teacherID,
                          studentList: studentList,
                          subjectID: subjectIdTable,
                        },
                      ];
                      let newArr = [];
                      parentArr.forEach((parent) => {
                        parent.studentList.forEach((child) => {
                          newArr.push({
                            classID: parent.classID,
                            teacherID: parent.teacherID,
                            studentID: child.studentID,
                            subjectID: parent.subjectID,
                          });
                        });
                      });
                      newArr.forEach((data) => {
                        connection.query(
                          "INSERT INTO class_student SET classID = ?, teacherID = ?, studentID = ?, subjectID = ?;",
                          [
                            data.classID,
                            data.teacherID,
                            data.studentID,
                            data.subjectID,
                          ],
                          function (err, results) {
                            if (err) {
                              connection.rollback(function () {
                                connection.release();
                                console.log(err);
                              });
                            }
                          }
                        );
                      });
                      connection.query(
                        "UPDATE class_index SET updatedAt = ? WHERE classID = ?",
                        [updatedAt, req.params.classID],
                        function (err, results) {
                          if (err) {
                            connection.rollback(function () {
                              connection.release();
                              console.log(err);
                            });
                          } else {
                            connection.commit(function (err) {
                              if (err) {
                                connection.rollback(function () {
                                  connection.release();
                                  console.log(err);
                                });
                              } else {
                                connection.release();
                                res
                                  .status(200)
                                  .send("Class successfully updated.");
                              }
                            });
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
      }
    }
  );
};

// View Subject
export const viewClass = (req, res) => {
  // User the connection
  db.query(
    "SELECT * FROM subject_index WHERE subjectID = ?",
    [req.params.subjectID],
    (err, rows) => {
      if (!err) {
        res.send(rows);
      } else {
        res.send(err);
      }
    }
  );
};

// Delete Class
export const deleteClass = (req, res) => {
  const { selectedID } = req.body;
  const { teacherID } = req.params;

  db.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.status(500).send("Something went wrong.");
    } else {
      connection.query(
        "SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;",
        function (err) {
          if (err) {
            console.log(err);
            res.status(500).send("Something went wrong.");
          } else {
            connection.beginTransaction(function (err) {
              if (err) {
                connection.rollback(function (err) {
                  connection.release();
                  console.log(err);
                  res.status(500).send("Something went wrong.");
                });
              } else {
                connection.query(
                  "DELETE FROM class_index WHERE classID = ?",
                  [selectedID],
                  function (err) {
                    if (err) {
                      connection.rollback(function () {
                        connection.release();
                        console.log(err);
                        res.status(500).send("Something went wrong.");
                      });
                    } else {
                      connection.query(
                        "DELETE FROM class_student WHERE classID = ?",
                        [selectedID],
                        function (err) {
                          if (err) {
                            connection.rollback(function () {
                              connection.release();
                              console.log(err);
                              res.status(500).send("Something went wrong.");
                            });
                          } else {
                            connection.query(
                              "DELETE FROM lesson_entries WHERE classID = ?",
                              [selectedID],
                              function (err) {
                                if (err) {
                                  console.log("Error 1");
                                  connection.rollback(function () {
                                    connection.release();
                                    res
                                      .status(500)
                                      .send("Something went wrong.");
                                  });
                                } else {
                                  connection.query(
                                    "DELETE FROM schedule_info WHERE classID = ?",
                                    [selectedID],
                                    function (err) {
                                      if (err) {
                                        console.log("Error 2");
                                        connection.rollback(function () {
                                          connection.release();
                                          res
                                            .status(500)
                                            .send("Something went wrong");
                                        });
                                      } else {
                                        connection.query(
                                          "DELETE FROM schedule_index WHERE classID = ?",
                                          [selectedID],
                                          function (err) {
                                            if (err) {
                                              console.log("Error 3");
                                              connection.rollback(function () {
                                                connection.release();
                                                res
                                                  .status(500)
                                                  .send("Something went wrong");
                                              });
                                            } else {
                                              connection.commit(function () {
                                                connection.release();
                                                res
                                                  .status(200)
                                                  .send(
                                                    "Class successfully deleted."
                                                  );
                                              });
                                            }
                                          }
                                        );
                                      }
                                    }
                                  );
                                }
                              }
                            );
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

// Add new class
export const create = async (req, res) => {
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
  // console.log(req.body);

  db.query(
    "INSERT INTO classIndex SET teacherID = ?, subjectID = ?, subjectTitle = ?, subjectLevel = ?, syllabusCode = ?, subjectGroup = ?, classIdentifier = ?, createdAt = ?;",
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
    function (err) {
      if (err) {
        res.status(500).send("Something went wrong...");
      } else {
        console.log("Class insert successful!");
      }
    }
  );

  db.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
    } else {
      db.query("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;", function (err) {
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
                "SELECT classID from classIndex WHERE teacherID = ? AND subjectID = ? AND syllabusCode = ? AND classIdentifier = ?;",
                [teacherID, subjectID, syllabusCode, classIdentifier],
                function (err, results) {
                  if (err) {
                    connection.rollback(function () {
                      connection.release;
                      console.log(err);
                    });
                  } else {
                    let parentArr = [
                      {
                        classID: results[0].classID,
                        teacherID: teacherID,
                        studentList: studentList,
                        subjectID: subjectID,
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
                        "INSERT INTO classStudent SET classID = ?, teacherID = ?, studentID = ?, subjectID = ?;",
                        [
                          data.classID,
                          data.teacherID,
                          data.studentID,
                          data.subjectID,
                        ],
                        function (err, results) {
                          if (err) {
                            connection.rollback(function () {
                              connection.release;
                              console.log(err);
                            });
                          }
                        }
                      );
                    });
                    connection.commit(function (err) {
                      if (err) {
                        connection.rollback(function () {
                          connection.release;
                          console.log(err);
                        });
                      } else {
                        connection.release();
                        res.status(200).send("Class successfully Created.");
                      }
                    });
                  }
                }
              );
            }
          });
        }
      });
    }
  });
};

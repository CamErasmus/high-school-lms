import { db } from "../startup/db.js";

// View Subjects
export const table = (req, res) => {
  // User the connection
  db.query("SELECT * FROM subject_index", (err, rows) => {
    // When done with the connection, release it
    if (!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  });
};

// View Subjects on Table
export const tableCount = async (req, res) => {
  db.query("SELECT COUNT(*) AS 'count' FROM subject_index", (err, result) => {
    res.send(result);
  });
};

export const subjectAdd = (req, res) => {
  db.query(
    "SELECT syllabusCode, subjectLevel, subjectTitle, subjectGroup FROM subject_index WHERE subjectID = ?",
    [req.params.subjectID],
    (err, response) => {
      if (!err) {
        res.send(response);
      } else {
        console.log(err);
      }
    }
  );
};

// Add new subject
export const create = async (req, res) => {
  const createdAt = new Date().toLocaleString("en-GB", {
    timeZone: "Africa/Johannesburg",
  });
  const { subjectTitle, subjectLevel, syllabusCode, subjectGroup } = req.body;

  // Use the connection

  db.query(
    "SELECT syllabusCode FROM subject_index WHERE syllabusCode = ? AND subjectLevel = ?",
    [syllabusCode, subjectLevel],
    (err, results) => {
      if (results.length !== 0) {
        res
          .status(409)
          .send(
            `${subjectTitle} ${subjectLevel} (${syllabusCode}) already exists on the system. (Only one of each is required).`
          );
      } else {
        db.query(
          "INSERT INTO subject_index SET subjectTitle = ?, subjectLevel = ?, syllabusCode = ?, subjectGroup = ?, createdAt = ?",
          [subjectTitle, subjectLevel, syllabusCode, subjectGroup, createdAt],
          (err) => {
            if (!err) {
              res.status(200).send("Subject added successfully.");
            } else {
              res.send(err);
            }
          }
        );
      }
    }
  );
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

// Update Subject
export const update = async (req, res) => {
  const { subjectTitle, subjectLevel, syllabusCode, subjectGroup } = req.body;

  const updatedAt = new Date().toLocaleString("en-GB", {
    timeZone: "Africa/Johannesburg",
  });

  // User the connection
  db.query(
    "UPDATE subject_index SET subjectTitle = ?, subjectLevel = ?, syllabusCode = ?, subjectGroup = ?, updatedAt = ? WHERE subjectID = ?",
    [
      subjectTitle,
      subjectLevel,
      syllabusCode,
      subjectGroup,
      updatedAt,
      req.params.subjectID,
    ],
    (err) => {
      if (!err) {
        // Use the connection
        db.query(
          "SELECT * FROM subject_index WHERE subjectID = ?",
          [req.params.subjectID],
          (err) => {
            if (!err) {
              res
                .status(200)
                .send(`${subjectTitle} has been updated successfully.`);
            } else {
              res.send({ alert: err });
            }
          }
        );
      } else {
        res.send({ alert: err });
      }
    }
  );
};

// View Subject
export const viewSubject = (req, res) => {
  // User the connection
  db.query(
    "SELECT * FROM subject_index WHERE subjectID = ?",
    [req.params.subjectID],
    (err, rows) => {
      if (!err) {
        res.send(rows);
      } else {
        res.send({ alert: err });
      }
    }
  );
};

// Edit Subject
export const edit = async (req, res) => {
  // User the connection
  db.query(
    "SELECT * FROM subject_index WHERE subjectID = ?",
    [req.params.subjectID],
    (err, rows) => {
      if (!err) {
        res.send(rows);
      } else {
        res.send({ alert: err });
      }
    }
  );
};

// Delete Subject
export const deleteSubject = (req, res) => {
  // User the connection
  db.query(
    "DELETE FROM subject_index WHERE subjectID = ?",
    [req.params.subjectID],
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

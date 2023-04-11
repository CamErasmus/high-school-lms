import { db } from "../startup/db.js";

//
export const countEnrolled = (req, res) => {
  // User the connection
  db.query(
    "SELECT COUNT(*) FROM user_index WHERE role = 'student';",
    (err, results) => {
      // When done with the connection, release it
      if (!err) {
        res.send(results);
      } else {
        console.log(err);
      }
    }
  );
};

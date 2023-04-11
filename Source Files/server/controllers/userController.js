import { db } from "../startup/db.js";
import { generateHash } from "../middleware/hash.js";
import { Knock } from "@knocklabs/node";

const knock = new Knock("sk_test_-FYD_Ozznz8t2G_y8iNToLVF71G48MA5Ypwgc5-SnLw");

// View Users
export const view = (req, res) => {
  // User the connection
  db.query("SELECT * FROM user_index ORDER BY firstName ASC", (err, rows) => {
    // When done with the connection, release it
    if (!err) {
      res.send(rows);
    } else {
      console.log(err).res.send({ alert: err });
    }
  });
};

export const table = (req, res) => {
  // User the connection
  db.query(
    "SELECT userID, firstName, lastName, email, role, createdAt, updatedAt, lastLogin FROM user_index WHERE email != 'admin@synaptic.icu' ORDER BY firstName ASC",
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

export const count = (req, res) => {
  db.query(
    "SELECT COUNT(*) AS 'count' FROM user_index WHERE email != 'admin@synaptic.icu';",
    (err, response) => {
      if (!err) {
        res.send(response);
      } else {
        console.log(err);
      }
    }
  );
};

// View Users
export const me = async (req, res) => {
  db.query(
    "SELECT userID, firstName, lastName, role, email FROM user_index WHERE userID = ?",
    [req.params.userID],
    (err, result) => {
      res.send(result);
    }
  );
};

// Add new user
export const create = async (req, res) => {
  const password = req.body.password;
  const encryptedPassword = await generateHash(password);
  const createdAt = new Date().toLocaleString("en-GB", {
    timeZone: "Africa/Johannesburg",
  });

  const { firstName, lastName, role, email, actor } = req.body;

  const bell = async () => {
    const superadmins = async () => {
      let sql =
        "SELECT email AS 'id' FROM user_index WHERE role = 'superAdmin';";
      return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };
    const results = await superadmins();
    await knock.users.identify(`${email}`, {
      name: `${firstName} ${lastName}`,
      email: `${email}`,
    });
    await knock.notify("newuser", {
      data: {
        name: `${firstName} ${lastName}`,
        email: `${email}`,
        password: `${password}`,
        url: "https://demo.synaptic.icu",
        school: "Clift College",
      },

      recipients: [{ id: `${email}`, email: `${email}` }],
    });
    await knock.notify("newuserinapp", {
      data: {
        name: `${firstName} ${lastName}`,
        email: `${email}`,
      },
      actor: {
        id: `${actor}`,
      },
      recipients: results,
    });
  };

  // Use the connection
  db.query(
    "SELECT email FROM user_index WHERE email = ?",
    [email],
    (err, results) => {
      if (results.length !== 0) {
        res
          .status(409)
          .send(`A user with the email of '${email}' already exists.`);
      } else {
        db.query(
          "INSERT INTO user_index SET firstName = ?, lastName = ?, role = ?, email = ?, password = ?, createdAt = ?",
          [firstName, lastName, role, email, encryptedPassword, createdAt],
          (err) => {
            if (!err) {
              res.status(200).send("User added successfully.");
              bell();
            } else {
              res.send(err);
            }
          }
        );
      }
    }
  );
};

// Find User by Search
export const find = (req, res) => {
  let searchTerm = req.body.search;
  // Use the connection
  db.query(
    "SELECT * FROM user_index WHERE firstName LIKE ? OR lastName LIKE ?",
    ["%" + searchTerm + "%", "%" + searchTerm + "%"],
    (err, rows) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err).res.send({ alert: err });
      }
    }
  );
};

// Update User
export const update = async (req, res) => {
  const password = req.body.password;
  const encryptedPassword = await generateHash(password);

  const { firstName, lastName, role, email } = req.body;

  const updatedAt = new Date().toLocaleString({
    timeZone: "Africa/Pretoria",
  });
  const bell = async () => {
    await knock.users.identify(`${email}`, {
      name: `${firstName} ${lastName}`,
      email: `${email}`,
    });
  };

  if (password.length === 0) {
    db.query(
      "UPDATE user_index SET firstName = ?, lastName = ?, role = ?, email = ?, updatedAt = ? WHERE userID = ?",
      [firstName, lastName, role, email, updatedAt, req.params.userID],
      (err) => {
        if (!err) {
          // Use the connection
          db.query(
            "SELECT * FROM user_index WHERE userID = ?",
            [req.params.userID],
            (err) => {
              if (!err) {
                res
                  .status(200)
                  .send(
                    `${firstName}'s account has been updated successfully.`
                  );
                bell();
              } else {
                res.send(err);
              }
            }
          );
        } else {
          res.send(err);
        }
      }
    );
  } else {
    db.query(
      "UPDATE user_index SET firstName = ?, lastName = ?, role = ?, email = ?, password = ?, updatedAt = ? WHERE userID = ?",
      [
        firstName,
        lastName,
        role,
        email,
        encryptedPassword,
        updatedAt,
        req.params.userID,
      ],
      (err) => {
        if (!err) {
          // Use the connection
          db.query(
            "SELECT * FROM user_index WHERE userID = ?",
            [req.params.userID],
            (err) => {
              if (!err) {
                res
                  .status(200)
                  .send(
                    `${firstName} ${lastName}'s account has been updated successfully.`
                  );
              } else {
                res.send(err);
              }
            }
          );
        } else {
          res.send(err);
        }
      }
    );
  }
};

// View Users
export const viewUser = (req, res) => {
  // User the connection
  db.query(
    "SELECT * FROM user_index WHERE userID = ?",
    [req.params.userID],
    (err, rows) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err).res.send({ alert: err });
      }
    }
  );
};

// Edit user
export const edit = async (req, res) => {
  db.query(
    "SELECT * FROM user_index WHERE userID = ?",
    [req.params.userID],
    (err, rows) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err).res.send({ alert: err });
      }
    }
  );
};

export const deleteUser = (req, res) => {
  const userID = req.body.email;
  const knockdelete = async () => {
    await knock.users.delete(`${userID}`);
  };
  // User the connection
  db.query(
    "DELETE FROM user_index WHERE userID = ?",
    [req.params.userID],
    (err, rows) => {
      // When done with the connection, release it
      if (!err) {
        knockdelete();
        res.send("Successfully deleted");
      } else {
        res.send(err);
      }
    }
  );
};

export const updateMe = async (req, res) => {
  const password = req.body.password;
  const userID = req.params.userID;
  const encryptedPassword = await generateHash(password);

  if (password.length > 0) {
    db.query(
      "UPDATE user_index SET password = ? WHERE userID = ?",
      [encryptedPassword, userID],
      (err) => {
        if (!err) {
          res.send("Password successfully changed.");
        } else {
          res.send("Something went wrong, please try again.");
        }
      }
    );
  } else {
    return;
  }
};

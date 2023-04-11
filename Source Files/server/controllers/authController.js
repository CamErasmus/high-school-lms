import { db } from "../startup/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const lastLogin = new Date().toLocaleString("en-GB", {
    timeZone: "Africa/Johannesburg",
  });

  db.query(
    "SELECT * FROM user_index WHERE email = ? LIMIT 1;",
    email,
    (error, result) => {
      if (error) {
        res.send({ error });
      }

      if (result.length !== 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {
            db.query("UPDATE user_index SET lastLogin = ? WHERE email = ?", [
              lastLogin,
              email,
            ]);

            const payloadObj = {
              userID: result[0].userID,
              firstName: result[0].firstName,
              lastName: result[0].lastName,
              email: result[0].email,
              role: result[0].role,
            };

            const token = jwt.sign(payloadObj, "DemoPrivateKey");

            res.status(200).json({ token });
            console.log("Login Attempt", res.statusMessage, req.body);
          } else {
            res.status(400).send("Invalid credentials!");
            console.log("Login Attempt", res.statusMessage, req.body);
          }
        });
      } else {
        res.status(400).send("User does not exist.");
        console.log("Login Attempt", res.statusMessage, req.body);
      }
    }
  );
};

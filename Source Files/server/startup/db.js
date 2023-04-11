import { createPool } from "mysql2";

export const db = createPool({
  host: "localhost",
  user: "root",
  password: "CamE1996!",
  database: "demo",
  port: "3306",
  connectionLimit: 25,
  waitForConnections: true,
  multipleStatements: true,
});

db.getConnection((err, connection) => {
  if (err) throw err;
  console.log("Database connected successfully");
  connection.release();
});

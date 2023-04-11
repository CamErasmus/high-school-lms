import jwt from "jsonwebtoken";

export const decoded = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401);

  try {
    const decoded = jwt.verify(token, "DemoPrivateKey");
    req.user.userID = decoded;
    next();
  } catch (ex) {
    res.status(400);
  }
};

export const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res
      .status(401)
      .send({ message: "Access denied. No token provided!" });

  try {
    const decoded = jwt.verify(token, "DemoPrivateKey");
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send({ message: "Invalid Token." });
  }
};

export const superAdmin = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!auth && !token)
    return res.status(401).send({ message: "Access denied." });

  const decoded = jwt.verify(token, "DemoPrivateKey");
  if (auth && ["superAdmin"].includes(decoded.role)) {
    next();
  } else {
    res.status(400).send({ message: "Access denied!" });
  }
};

export const admin = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!auth && !token)
    return res.status(401).send({ message: "Access denied." });

  const decoded = jwt.verify(token, "DemoPrivateKey");
  if (auth && ["superAdmin", "admin"].includes(decoded.role)) {
    next();
  } else {
    res.status(400).send({ message: "Access denied!" });
  }
};

export const teacher = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!auth && !token)
    return res.status(401).send({ message: "Access denied." });

  const decoded = jwt.verify(token, "DemoPrivateKey");
  if (auth && ["superAdmin", "admin", "teacher"].includes(decoded.role)) {
    next();
  } else {
    res.status(400).send({ message: "Access denied!" });
  }
};

export const student = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!auth && !token)
    return res.status(401).send({ message: "Access denied." });

  const decoded = jwt.verify(token, "DemoPrivateKey");
  if (
    auth &&
    ["superAdmin", "admin", "teacher", "student"].includes(decoded.role)
  ) {
    next();
  } else {
    res.status(400).send({ message: "Access denied!" });
  }
};

export const parent = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!auth && !token)
    return res.status(401).send({ message: "Access denied." });

  const decoded = jwt.verify(token, "DemoPrivateKey");
  if (
    auth &&
    ["superAdmin", "admin", "teacher", "student", "parent"].includes(
      decoded.role
    )
  ) {
    next();
  } else {
    res.status(400).send({ message: "Access denied!" });
  }
};

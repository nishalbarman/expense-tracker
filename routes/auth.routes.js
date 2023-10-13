const { Router } = require("express");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET;
const DEBUG = process.env.DEBUG;

const router = Router();

// validate the signup form
const validateRegister = (req, res, next) => {
  if (req.body.name && req.body.password && req.body.email) {
    next();
  } else {
    return res.send({ message: "Missing required fields" });
  }
};

// validate the login form
const validateLogin = (req, res, next) => {
  if (req.body.password && req.body.email) {
    next();
  } else {
    return res.send({ message: "Missing required fields" });
  }
};

// signup route to register

router.post("/signup", validateRegister, (req, res) => {
  try {
    const data = fs.readFileSync(path.resolve("./db.json"), {
      encoding: "utf-8",
    }); // reading user data from file
    const parsedData = JSON.parse(data);
    req.body.id = Date.now() + Math.round(Math.random() * 1000) + 1000;
    parsedData.users.push(req.body);
    fs.writeFileSync(path.resolve("./db.json"), JSON.stringify(parsedData), {
      encoding: "utf-8",
    });
    return res.status(201).send({ status: true, message: "User created!" });
  } catch (err) {
    console.log(err);
    if (DEBUG) {
      return res.send({ status: false, message: err.message });
    }
    return res.send({ status: false, message: "Server error!" });
  }
});

// login route to register

router.post("/login", validateLogin, (req, res) => {
  try {
    const data = fs.readFileSync(path.resolve("./db.json"), {
      encoding: "utf-8",
    }); // reading user data from file
    const parsedData = JSON.parse(data);
    const user = parsedData.users.filter((user) => {
      return (
        user.email === req.body.email && user.password === req.body.password
      );
    });

    console.log(user);
    if (user.length > 0) {
      console.log(user.email);
      const token = jwt.sign({ email: user[0].email }, secret);
      return res
        .status(200)
        .send({ status: true, token: token, message: "Login successful!" });
    } else {
      return res.send({ status: false, message: "Invalid credentials!" });
    }
  } catch (err) {
    console.log(err);
    if (DEBUG) {
      return res.send({ status: false, message: err.message });
    }
    return res.send({ status: false, message: "Server error!" });
  }
});

module.exports = router;

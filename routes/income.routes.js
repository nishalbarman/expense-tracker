const { Router } = require("express");
const fs = require("fs");
const path = require("path");

const authenticate = require("../middleware/authenticate"); // athenticate middleware

const router = Router();

const secret = process.env.SECRET;
const DEBUG = process.env.DEBUG;

// middlware to authencticate user
router.use(authenticate);

router.get("/", (req, res) => {
  console.log(req.email);
  try {
    const data = fs.readFileSync(path.resolve("./db.json"), {
      encoding: "utf-8",
    }); // reading data from file
    const parsedData = JSON.parse(data);
    const userData = parsedData.income.filter((income) => {
      return income.email === req.email;
    });
    return res.status(200).send({ status: true, data: userData });
  } catch (er) {
    if (DEBUG) {
      return res.send({ status: false, message: err.message });
    }
    return res.send({ status: false, message: "Server error!" });
  }
});

// create income

router.post("/create", (req, res) => {
  try {
    const data = fs.readFileSync(path.resolve("./db.json"), {
      encoding: "utf-8",
    }); // reading data from file
    const parsedData = JSON.parse(data);
    req.body.id = Date.now() + Math.round(Math.random() * 1000) + 1000;
    req.body.email = req.email;
    parsedData.income.push(req.body);
    fs.writeFileSync(path.resolve("./db.json"), JSON.stringify(parsedData), {
      encoding: "utf-8",
    });
    return res
      .status(200)
      .send({ status: true, message: "income added!", data: req.body });
  } catch (er) {
    if (DEBUG) {
      return res.send({ status: false, message: err.message });
    }
    return res.send({ status: false, message: "Server error!" });
  }
});

// update income

router.put("/update/:id", (req, res) => {
  try {
    const data = fs.readFileSync(path.resolve("./db.json"), {
      encoding: "utf-8",
    }); // reading data from file
    const parsedData = JSON.parse(data);

    let index = -1;
    parsedData.income.forEach((exp, i) => {
      if (exp.id === +req.params.id) {
        index = i;
      }
    });
    console.log(index);

    if (index >= 0 && parsedData.income[index].email === req.email) {
      console.log("Id from body=>", req.body.id);
      req.body.id = parsedData.income[index].id;
      parsedData.income[index] = req.body;
      fs.writeFileSync(path.resolve("./db.json"), JSON.stringify(parsedData), {
        encoding: "utf-8",
      });
      return res
        .status(200)
        .send({ status: true, message: "income updated!", data: req.body });
    }

    return res
      .status(200)
      .send({ status: true, message: "income not found for the given id!" });
  } catch (err) {
    if (DEBUG) {
      return res.send({ status: false, message: err.message });
    }
    return res.send({ status: false, message: "Server error!" });
  }
});

// delete income

router.delete("/delete/:id", (req, res) => {
  try {
    const data = fs.readFileSync(path.resolve("./db.json"), {
      encoding: "utf-8",
    }); // reading data from file
    const parsedData = JSON.parse(data);

    let index = -1;
    parsedData.income.forEach((exp, i) => {
      if (exp.id === +req.params.id) {
        index = i;
      }
    });
    console.log(index);

    if (index >= 0 && parsedData.income[index].email === req.email) {
      req.body.id = parsedData.income[index].id;
      parsedData.income.splice(index, 1);
      fs.writeFileSync(path.resolve("./db.json"), JSON.stringify(parsedData), {
        encoding: "utf-8",
      });
      return res.status(200).send({ status: true, message: "income deleted!" });
    }

    return res
      .status(200)
      .send({ status: true, message: "income not found for the given id!" });
  } catch (er) {
    if (DEBUG) {
      return res.send({ status: false, message: err.message });
    }
    return res.send({ status: false, message: "Server error!" });
  }
});

module.exports = router;

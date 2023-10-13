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
    const userData = parsedData.expense.filter((expense) => {
      return expense.email === req.email;
    });
    return res.status(200).send({ status: true, data: userData });
  } catch (er) {
    if (DEBUG) {
      return res.send({ status: false, message: err.message });
    }
    return res.send({ status: false, message: "Server error!" });
  }
});

// create expense

router.post("/create", (req, res) => {
  try {
    const data = fs.readFileSync(path.resolve("./db.json"), {
      encoding: "utf-8",
    }); // reading data from file
    const parsedData = JSON.parse(data);
    req.body.id = Date.now() + Math.round(Math.random() * 1000) + 1000;
    req.body.email = req.email;
    parsedData.expense.push(req.body);
    fs.writeFileSync(path.resolve("./db.json"), JSON.stringify(parsedData), {
      encoding: "utf-8",
    });
    return res
      .status(200)
      .send({ status: true, message: "Expense added!", data: req.body });
  } catch (er) {
    if (DEBUG) {
      return res.send({ status: false, message: err.message });
    }
    return res.send({ status: false, message: "Server error!" });
  }
});

// update expense

router.put("/update/:id", (req, res) => {
  try {
    const data = fs.readFileSync(path.resolve("./db.json"), {
      encoding: "utf-8",
    }); // reading data from file
    const parsedData = JSON.parse(data);

    let index = -1;
    parsedData.expense.forEach((exp, i) => {
      if (exp.id === +req.params.id) {
        index = i;
      }
    });
    console.log(index);

    if (index >= 0 && parsedData.expense[index].email === req.email) {
      delete req.body.id;
      parsedData.expense[index] = req.body;
      fs.writeFileSync(path.resolve("./db.json"), JSON.stringify(parsedData), {
        encoding: "utf-8",
      });
      return res
        .status(200)
        .send({ status: true, message: "Expense updated!" });
    }

    return res.status(200).send({
      status: true,
      message: "Expense not found for the given id!",
      data: req.body,
    });
  } catch (er) {
    if (DEBUG) {
      return res.send({ status: false, message: err.message });
    }
    return res.send({ status: false, message: "Server error!" });
  }
});

// delete expense

router.delete("/delete/:id", (req, res) => {
  try {
    const data = fs.readFileSync(path.resolve("./db.json"), {
      encoding: "utf-8",
    }); // reading data from file
    const parsedData = JSON.parse(data);

    let index = -1;
    parsedData.expense.forEach((exp, i) => {
      if (exp.id === +req.params.id) {
        index = i;
      }
    });
    console.log(index);

    if (index >= 0 && parsedData.expense[index].email === req.email) {
      req.body.id = parsedData.expense[index].id;
      parsedData.expense.splice(index, 1);
      fs.writeFileSync(path.resolve("./db.json"), JSON.stringify(parsedData), {
        encoding: "utf-8",
      });
      return res
        .status(200)
        .send({ status: true, message: "Expense deleted!" });
    }

    return res
      .status(200)
      .send({ status: true, message: "Expense not found for the given id!" });
  } catch (error) {
    if (DEBUG) {
      return res.send({ status: false, message: err.message });
    }
    return res.send({ status: false, message: "Server error!" });
  }
});

module.exports = router;

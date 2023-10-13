const jwt = require("jsonwebtoken");

const secret = process.env.SECRET;
const DEBUG = process.env.DEBUG;

const authenticate = (req, res, next) => {
  try {
    if (req.get("token")) {
      const token = req.get("token");
      const result = jwt.verify(token, secret);
      console.log("Auth middleware => ", result);
      if (result) {
        req.email = result.email;
        console.log(result);
        next();
        return;
      }
    }
    return res.send({ status: false, message: "Unauthorised access!" });
  } catch (err) {
    console.log(err);
    if (DEBUG) {
      return res.send({ status: false, message: err.message });
    }
    return res.send({ status: false, message: "Server error!" });
  }
};

module.exports = authenticate;

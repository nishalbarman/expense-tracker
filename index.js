require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 8000;

const auth_route = require("./routes/auth.routes");
const expense_route = require("./routes/expense.routes");
const income_route = require("./routes/income.routes");

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/auth", auth_route);
app.use("/expense", expense_route);
app.use("/income", income_route);

app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`);
});

const express = require("express");
const app = express();
const pg = require("./query.js");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.get("/api/students", pg.getStudents);
app.get("/api/students/:id", pg.getStudentById);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App runnning on port ${port}`);
});

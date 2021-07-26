const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App runnning on port ${port}`);
});

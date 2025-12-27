const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Node.js chạy OK trên Render 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);

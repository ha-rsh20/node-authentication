const express = require("express");
const app = express();
const cors = require("cors");
const auth_routes = require("./Routes/auth");
const connect = require("./dbconnect");

connect.connect();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);
app.use("/auth", auth_routes);


app.listen(4000, () => console.log("Listening on port 4000"));

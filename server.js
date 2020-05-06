const express = require("express");
const dotenv = require("dotenv");
const studentRouter = require("./routes/student");
const roomRouter = require("./routes/room");
const staticRouter = require("./routes/static/staticRoutes");
const morgan = require("morgan");
const connectDb = require("./config/db");
const erroHandler = require("./middleware/errorHandler");
const authRouter = require("./routes/auth");
const cookieParser = require("cookie-parser");
//load env variables
dotenv.config({ path: "./config/config.env" });

const app = express();

//using the templating engine
app.set("view engine", "ejs");
app.set("views", "views");
//connect to the database
connectDb();
//to parse the json
app.use(express.json());
app.use(cookieParser());
//logging the requests
if (process.env.DEV_ENV === "development") {
  app.use(morgan("dev"));
}
if (process.env.JWT_SECRETKEY == undefined) {
  console.log("FATAL ERROR: jwt secret key is not provided");
  process.exit(1);
}
//Mounting userAuthentication routes
app.use("/api/v1/auth", authRouter);
//Mounting static routers
app.use(staticRouter);

//Mounting the studentDatabase routers
app.use("/api/v1/students", studentRouter);
//Mounting the roomDatabase routers
app.use("/api/v1/rooms", roomRouter);
//error handling middleware
app.use(erroHandler);
//launching the server
app.listen(
  process.env.PORT,
  console.log(
    `Listening with Env:${process.env.DEV_ENV} on port ${process.env.PORT}...`
  )
);

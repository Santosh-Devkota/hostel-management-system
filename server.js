const express = require("express");
const dotenv = require("dotenv");
const studentRouter = require("./routes/student");
const roomRouter = require("./routes/room");
const morgan = require("morgan");
const connectDb = require("./config/db");
// const erroHandler = require("./middleware/errorHandler");
const authRouter = require("./routes/auth");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const noticeRouter = require("./routes/notice");
const messFoodRouter = require("./routes/MessRoute/messFood");
const messDailyConsumptionRouter = require("./routes/MessRoute/dailyConsumption");
const messPaymentRouter = require("./routes/MessRoute/messPayment");
const studentQueryRouter = require("./routes/query");
const messageRouter = require("./routes/message");
//load env variables
dotenv.config({ path: "./config/config.env" });

const app = express();

app.use(cors());
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
app.use("/auth", authRouter);
//Mounting the notices routers
app.use("/",noticeRouter);

//Mounting student query routers
app.use("/",studentQueryRouter);

//Mounting the messfood route
app.use("/",messFoodRouter);

//Mounting mess Daily consumption route
app.use("/",messDailyConsumptionRouter);

//Mounting mess Payments route 
app.use("/",messPaymentRouter)

// Mounting message router 
app.use("/",messageRouter);
//Mounting the studentDatabase routers
app.use("/", studentRouter);
//Mounting the roomDatabase routers
app.use("/rooms", roomRouter);
//error handling middleware
// app.use(erroHandler);
//launching the server
const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(
    `Listening with Env:${process.env.DEV_ENV} on port ${process.env.PORT}...`
  )
);


const express = require("express");
const http = require("http");
const connectdb = require("./Config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {initializeSocket} = require("./Config/socketServer"); // Import socket logic
require("dotenv").config();
const userRouter = require("./Routes/userRoutes");
const ioRouter = require("./Routes/ioRoutes");
const tripRouter = require("./Routes/tripRoutes");
const ExpenseRouter = require("./Routes/expenceRoutes");
const ReportRouter = require("./Routes/reportRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandling");

const app = express();
const httpServer = http.createServer(app);

app.use(express.json());

// Fixed CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "https://travel-budget-zeta.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization" , "x-new-access-token" , "x-refresh-token"]
  })
);

app.use(cookieParser());

connectdb();

app.use("/user", userRouter);
app.use("/trip", tripRouter);
app.use("/expense", ExpenseRouter);
app.use("/report", ReportRouter);
app.use("/io", ioRouter);

app.get("/", (req, res) => {
  res.send("API is working");
});

// Initialize socket.io
initializeSocket(httpServer);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, () => {
  console.log(`Your server is running on http://localhost:${PORT}`);
});
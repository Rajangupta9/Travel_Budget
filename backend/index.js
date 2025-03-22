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

const app = express();
const httpServer = http.createServer(app);

app.use(express.json());
app.use(cors({
    origin: "*", // or specify your frontend domain like 'http://localhost:3000'
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'headers'], // Added 'headers' here
    credentials: true
  }));
app.use(cookieParser());

connectdb();

app.use("/user", userRouter);
app.use("/trip", tripRouter);

app.use("/io", ioRouter);

app.get("/", (req, res) => {
    res.send("API is working");
});

// Initialize socket.io
initializeSocket(httpServer);

const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, () => {
    console.log(`Your server is running on http://localhost:${PORT}`);
});
